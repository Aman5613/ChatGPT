const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");
const cookie = require("cookie");

const authSocketMiddleware = async (socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");

  if (!cookies.token)
    return next(new Error("Unauthorized : no token provided"));

  try {
    const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    socket.user = user;
  } catch (error) {
    return next(new Error("Unauthorized : invalid token"));
  }

  next();
};

module.exports = authSocketMiddleware;
