const Chat = require("../models/ChatModel");

exports.fetchChatData = async (userId, chatUserId) => {
  const chatData = await Chat.find({
    participants: { $all: [userId, chatUserId] },
  });
  return chatData;
};

exports.fetchAllMyChats = async (userId) => {
  const chats = await Chat.find({
    participants: { $in: [userId] },
  })
    .sort({ "lastMessage.timestamp": -1 })
    .select("participants lastMessage");

  return chats;
};

exports.updateMessageReadData = async (userId, chatUserId) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        participants: { $all: [userId, chatUserId] },
        "lastMessage.senderId": { $ne: userId },
      },
      {
        $set: { "lastMessage.read": true },
      },
      { new: true }
    );

    if (!chat) {
      return { message: "No chat found or already read." };
    }

    return chat;
  } catch (error) {
    console.error("Error marking last message as read:", error);
    throw error;
  }
};
