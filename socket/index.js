// backend/socket/index.js

const users = new Map(); // socket.id => userEmail

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for user info after connection
    socket.on('register', (userEmail) => {
      users.set(socket.id, userEmail);
      console.log(`Registered user ${userEmail} with socket ${socket.id}`);
      // Optionally notify others about user online status here
    });

    // Messaging: send message to a specific user
    socket.on('send-message', ({ to, message }) => {
      // Find socket id for recipient
      const recipientSocketId = [...users.entries()]
        .find(([id, email]) => email === to)?.[0];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive-message', {
          from: users.get(socket.id),
          message,
        });
      }
    });

    // WebRTC signaling: caller sends offer
    socket.on('offer', ({ to, offer }) => {
      const recipientSocketId = [...users.entries()]
        .find(([id, email]) => email === to)?.[0];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('offer', {
          from: users.get(socket.id),
          offer,
        });
      }
    });

    // Callee sends answer
    socket.on('answer', ({ to, answer }) => {
      const recipientSocketId = [...users.entries()]
        .find(([id, email]) => email === to)?.[0];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('answer', {
          from: users.get(socket.id),
          answer,
        });
      }
    });

    // ICE candidates exchange
    socket.on('ice-candidate', ({ to, candidate }) => {
      const recipientSocketId = [...users.entries()]
        .find(([id, email]) => email === to)?.[0];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('ice-candidate', {
          from: users.get(socket.id),
          candidate,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      users.delete(socket.id);
      // Optionally notify others about user offline status here
    });
  });
}

module.exports = socketHandler;
