const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);

  // Register user email
  socket.emit("register", "user1@example.com");

  // Send a test message to user2@example.com after 1 second
  setTimeout(() => {
    socket.emit("send-message", {
      to: "user2@example.com",
      message: "Hello from test client!",
    });
  }, 1000);

  // Listen for incoming messages
  socket.on("receive-message", (data) => {
    console.log("Received message:", data);
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
