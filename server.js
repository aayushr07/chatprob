// backend/server.js

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const socketHandler = require('./socket');
const { Server } = require('socket.io');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/messages', messageRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Backend API running...');
});

// Create HTTP server and setup Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize Socket.IO handlers
socketHandler(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
