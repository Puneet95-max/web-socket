const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:3000" }));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("join", ({ roomId }) => {
    socket.join(roomId);
    console.log(`🧵 Joined room: ${roomId}`);
  });

  socket.on("message", ({ roomId, message }) => {
    console.log(`📩 Received message for ${roomId}:`, message);
    console.log("Active rooms:", socket.rooms);
    socket.to(roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket server running on http://localhost:${PORT}`);
});
