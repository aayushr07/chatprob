// backend/routes/messageRoutes.js

const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require('../controllers/messageController');

// POST /api/messages/send - Send a message
router.post('/send', sendMessage);

// GET /api/messages/:user1/:user2 - Get all messages between two users
router.get('/:user1/:user2', getMessages);

module.exports = router;
