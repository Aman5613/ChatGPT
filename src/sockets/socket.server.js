const { Server } = require("socket.io");
const authSocketMiddleware = require("../Middleware/socket.middleware");
const messageModel = require("../Models/message.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const { create } = require("../Models/user.model");
const { json, text } = require("express");
const { createMemory, queryMemory } = require("../services/vector.service");

async function initSocket(httpServer) {
  const io = new Server(httpServer, () => {});

  io.use(authSocketMiddleware);

  io.on("connection", (socket) => {
    console.log(socket.user.fullName.firstName, "SOCKET - connected");

    // listen for incoming messages
    socket.on("message", async (payload) => {

      // Save the user message to the database
      const message =  await messageModel.create({
        chatID: payload.chatID,
        userID: socket.user._id,
        content: payload.prompt,
        role: "user",
      });

      
      // vectorization ->  jo bhi payload me prompt hai uska vector me convert karne ke liye -> using google's model
      const vector = await generateVector(payload.prompt);

      // console.log("Vector: ", vector);
      
      
      

      // store the vector in pinecone
      await createMemory([{
        messagesID : message._id,
        vector : vector,
        metadata: {
          chatID: payload.chatID,
          userID: socket.user._id,
          text : payload.prompt
        }
      }]);
      
      // chat history
      const stm = (
        await messageModel
        .find({ chatID: payload.chatID })
        .sort({ createdAt: -1 })  // latest message upar
        .limit(10) // purane ko bhulna jaruri hai bhai nhi to jeb dhila ho jaye ga
        .lean()  // performance ke liye
      ).reverse();
      
      // memorization
      const llm = await queryMemory({
        queryVector : vector,
        metadata :{ userID : socket.user._id },
        limit : 3
      })

      
      // console.log("stm: ", stm);
      // console.log( "llm: ", llm);
      

      // Generate AI response
      const response = await generateResponse(
        // Pass the chat history to the AI service
        JSON.stringify([...llm.map(m => m.metadata.text), ...stm.map(s => s.content)]),
        // payload.prompt
      );

      // Save the AI response to the database
      const aiMessage = await messageModel.create({
        chatID: payload.chatID,
        userID: socket.user._id,
        content: response,
        role: "model",
      });

      // vectorization of AI response
      const responseVector = await generateVector(response);

      // store the vector in pinecone
      await createMemory([{
        messagesID : aiMessage._id,
        vector : responseVector,
        metadata: {
          chatID: payload.chatID,
          userID: socket.user._id,
          text : response
        }
      }]);

      // Emit the AI response back to the client
      socket.emit("aiResponse", response);
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log(socket.user.fullName.firstName, "SOCKET - disconnected");
    });
  });
}

module.exports = initSocket;
