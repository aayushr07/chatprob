// backend/controllers/messageController.js

const Message = require('../models/Message');

// Save a new message
const sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const message = new Message({
      sender,
      receiver,
      content,
      timestamp: new Date()
    });

    await message.save();
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all messages between two users
const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
