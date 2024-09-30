const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: String },
  recipientId: { type: String },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: String }],
  messages: [messageSchema],
  lastMessage: {
    content: { type: String },
    timestamp: { type: Date },
    read: { type: Boolean },
    senderId: { type: String },
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
