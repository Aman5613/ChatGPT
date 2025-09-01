require("dotenv").config(); // env ko config karne ke liye
const app = require("./src/app");
const connectDB = require("./src/DB/db");
const authRoutes = require("./src/Routes/auth.route");
const chatRoutes = require("./src/Routes/chat.route");
const initSocket = require("./src/sockets/socket.server");

// Create HTTP server and initialize socket.io
const httpServer = require("http").createServer(app);
initSocket(httpServer);

// database connect kane ke liye
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// listen karne ke liye
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
