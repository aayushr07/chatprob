const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("User2 Connected with id:", socket.id);

  // Register user2 email
  socket.emit("register", "user2@example.com");

  // Listen for incoming messages
  socket.on("receive-message", (data) => {
    console.log("User2 Received message:", data);
  });

  // Reply back to user1 after 2 seconds
  setTimeout(() => {
    socket.emit("send-message", {
      to: "user1@example.com",
      message: "Hello user1, this is user2!",
    });
  }, 2000);
});
