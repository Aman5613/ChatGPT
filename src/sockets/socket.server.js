const { Server } = require("socket.io");
const authSocketMiddleware = require("../Middleware/socket.middleware");
const messageModel = require("../Models/message.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");

async function initSocket(httpServer) {
  const io = new Server(httpServer, () => {});

  io.use(authSocketMiddleware);

  io.on("connection", (socket) => {
    console.log(socket.user.fullName.firstName, "SOCKET - connected");

    // listen for incoming messages
    socket.on("message", async (payload) => {

      
      const[message, vector] = await Promise.all([

        // Save the user message to the database
        messageModel.create({
          chatID: payload.chatID,
          userID: socket.user._id,
          content: payload.prompt,
          role: "user",
        }),
  
        // vectorization ->  jo bhi payload me prompt hai uska vector me convert karne ke liye -> using google's model
        generateVector(payload.prompt)

      ]);


      
      const [llm, storeVector, stm] = await Promise.all([

        // memorization
        queryMemory({
          queryVector : vector,
          metadata :{ userID : socket.user._id },
          limit : 3
        }),
        
  
        // store the vector in pinecone
        createMemory([{
          messagesID : message._id,
          vector : vector,
          metadata: {
            chatID: payload.chatID,
            userID: socket.user._id,
            text : payload.prompt
          }
        }]),
        
        // chat history
        (
          await messageModel
          .find({ chatID: payload.chatID })
          .sort({ createdAt: -1 })  // latest message upar
          .limit(10) // purane ko bhulna jaruri hai bhai nhi to jeb dhila ho jaye ga
          .lean()  // performance ke liye
        ).reverse() // reverse krke wapis sahi order me la do

      ]);
      
      // console.log("stm: ", stm);
      // console.log( "llm: ", llm);
      

      // Generate AI response
      const response = await generateResponse(
        // Pass the chat history to the AI service
        JSON.stringify([...llm.map(m => m.metadata.text), ...stm.map(s => s.content)]),
        // payload.prompt
      );

      // Emit the AI response back to the client
      socket.emit("aiResponse", response);

      
      const[ saveResponse, responseVector] =  await Promise.all([
        // Save the AI response to the database
        messageModel.create({
          chatID: payload.chatID,
          userID: socket.user._id,
          content: response,
          role: "model",
        }),
  
        // vectorization of AI response
        generateVector(response),

      ])

      // store the vector in pinecone
      await createMemory([{
        messagesID : saveResponse._id,
        vector : responseVector,
        metadata: {
          chatID: payload.chatID,
          userID: socket.user._id,
          text : response
        }
      }]);

      
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log(socket.user.fullName.firstName, "SOCKET - disconnected");
    });
  });
}

module.exports = initSocket;
