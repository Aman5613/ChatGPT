const chatModel = require('../Models/chat.model');

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  try {
    const newChat = await chatModel.create({
      user: user._id,
      title,
    });
    res.status(201).json({
      message: "Chat created successfully",
      chat: newChat
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
}

module.exports = {
  createChat,
};
