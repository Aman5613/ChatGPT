const { Server } = require("socket.io");
const cors = require("cors");

async function initSocket(httpServer) {
  const io = new Server(httpServer, () => {
    console.log("Socket.io server is running");
    cors: {
      origin: "http://localhost:5173"  // frontend URL
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  //   return io;
}

module.exports = initSocket;
