const dotenv = require("dotenv");
const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
dotenv.config({ path: "./config.env" });

const app = require("./app");
const mongoose = require("mongoose");
const Chat = require("./models/ChatModel");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB connection successful!");
  });

const port = process.env.PORT || 8000;

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    socket.userId = userId;
  });

  socket.on("send-message", async (message) => {
    const { recipientId, message: messageContent } = message;

    try {
      const recipientSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.userId === recipientId
      );

      let chat = await Chat.findOne({
        participants: { $all: [socket.userId, recipientId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [socket.userId, recipientId],
          messages: [],
        });
      }

      chat.messages.push({
        senderId: socket.userId,
        recipientId: recipientId,
        message: messageContent.message,
      });

      chat.lastMessage = {
        content: messageContent.message,
        timestamp: Date.now(),
        read: false,
        senderId: socket.userId,
      };

      await chat.save();

      recipientSocket.emit("chat-message", {
        senderId: socket.userId,
        message: messageContent.message,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
