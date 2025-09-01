const userModel = require("../Models/user.model");
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  req.user = user;

  next();
}

module.exports = authMiddleware;
