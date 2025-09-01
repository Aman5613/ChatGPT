const { Server } = require("socket.io");
const authSocketMiddleware = require("../Middleware/socket.middleware");
const messageModel = require("../Models/message.model");
const { generateResponse } = require("../services/ai.service");
const { create } = require("../Models/user.model");

async function initSocket(httpServer) {
  const io = new Server(httpServer, () => {});

  io.use(authSocketMiddleware);

  io.on("connection", (socket) => {
    console.log(socket.user.fullName.firstName, "SOCKET - connected");

    // listen for incoming messages
    socket.on("message", async (payload) => {
      // Save the user message to the database
      await messageModel.create({
        chatID: payload.chatID,
        userID: socket.user._id,
        content: payload.prompt,
        role: "user",
      });

      // chat history
      const chatHistory = await messageModel.find({ chatID: payload.chatID }).select("role content -_id");

      // console.log(chatHistory);

      // Generate AI response
      const response = await generateResponse( JSON.stringify(chatHistory));

      // Save the AI response to the database
      await messageModel.create({
        chatID: payload.chatID,
        userID: socket.user._id,
        content: response,
        role: "model",
      });

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
