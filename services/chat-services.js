const {
  fetchChatData,
  fetchAllMyChats,
  updateMessageReadData,
} = require("../data/chat-data");
const { fetchUsersFullNameData } = require("../data/user-data");

exports.getChat = async (userId, chatUserId) => {
  return await fetchChatData(userId, chatUserId);
};

exports.markMessageAsRead = async (userId, chatUserId) => {
  return await updateMessageReadData(userId, chatUserId);
};

exports.getAllMyChats = async (userId) => {
  const chats = await fetchAllMyChats(userId);

  for (const chat of chats) {
    const chatUser = chat.participants.filter(
      (participantId) => participantId !== userId
    );
    const user = await fetchUsersFullNameData(chatUser?.at(0));
    chat.user = user;
  }

  for (let i = 0; i < chats.length; i++) {
    chats[i] = chats[i].toObject();
    const chatUser = chats[i].participants.filter(
      (participantId) => participantId !== userId
    );
    const user = await fetchUsersFullNameData(chatUser?.at(0));
    chats[i].user = user;
  }

  return chats;
};
