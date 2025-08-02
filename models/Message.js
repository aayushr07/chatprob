// backend/models/Message.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String, // Email of sender
    required: true,
  },
  receiver: {
    type: String, // Email of receiver
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
