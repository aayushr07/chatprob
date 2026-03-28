// backend/socket/index.js

const users = new Map(); // ✅ FIX: userEmail => socket.id (flipped from before)

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('register', (userEmail) => {
      // ✅ FIX: overwrite any old socket ID for this email cleanly
      users.set(userEmail, socket.id);
      console.log(`Registered: ${userEmail} => ${socket.id}`);
    });

    socket.on('send-message', ({ to, message }) => {
      const recipientSocketId = users.get(to); // ✅ direct O(1) lookup
      const fromEmail = [...users.entries()].find(([email, id]) => id === socket.id)?.[0];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive-message', {
          from: fromEmail,
          message,
        });
      } else {
        console.log(`[send-message] Recipient not found: ${to}`);
      }
    });

    socket.on('offer', ({ to, offer, from }) => {
      const recipientSocketId = users.get(to); // ✅ direct lookup
      console.log(`[offer] from ${from} => to ${to} | recipient socket: ${recipientSocketId}`);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('offer', { from, offer });
      } else {
        // ✅ FIX: notify caller that recipient wasn't found instead of silent drop
        console.log(`[offer] Recipient ${to} not registered`);
        socket.emit('call-error', { message: `User ${to} is not online` });
      }
    });

    socket.on('answer', ({ to, answer, from }) => {
      const recipientSocketId = users.get(to); // ✅ direct lookup
      console.log(`[answer] from ${from} => to ${to} | recipient socket: ${recipientSocketId}`);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('answer', { from, answer });
      } else {
        console.log(`[answer] Recipient ${to} not registered`);
      }
    });

    socket.on('ice-candidate', ({ to, candidate, from }) => {
      const recipientSocketId = users.get(to); // ✅ direct lookup
      console.log(`[ice-candidate] from ${from} => to ${to} | recipient socket: ${recipientSocketId}`);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('ice-candidate', { from, candidate });
      } else {
        console.log(`[ice-candidate] Recipient ${to} not registered`);
      }
    });

    socket.on('call-ended', ({ to, from }) => {
      const recipientSocketId = users.get(to);
      console.log(`[call-ended] from ${from} => to ${to}`);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('call-ended');
      }
    });

    socket.on('call-rejected', ({ to, from }) => {
      const recipientSocketId = users.get(to);
      console.log(`[call-rejected] from ${from} => to ${to}`);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('call-rejected');
      }
    });

    socket.on('disconnect', () => {
      // ✅ FIX: find and remove by socket.id since map is now email => socketId
      for (const [email, id] of users.entries()) {
        if (id === socket.id) {
          users.delete(email);
          console.log(`Unregistered: ${email} (socket ${socket.id} disconnected)`);
          break;
        }
      }
    });
  });
}

module.exports = socketHandler;
