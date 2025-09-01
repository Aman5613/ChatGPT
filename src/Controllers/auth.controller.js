const userModel = require("../Models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  if (await userModel.findOne({ email }))
    return res.status(400).json({
      message: "user already registered",
    });

  const hashPass = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashPass,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "user register successfully",
    user: user,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) return res.status(401).json({ message: "User is not registered" });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    return res.status(401).json({ message: "password is incorrect" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({ message: "user logedin sucessfully" });
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "user logged out successfully" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
