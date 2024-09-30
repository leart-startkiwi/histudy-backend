const {
  fetchUserReplyUpvotesData,
  createReplyUpvoteQuestionData,
  deleteUpvoteReplyData,
} = require("../data/reply-upvote-data");

exports.getReplyUpvotes = async (userId) => {
  return await fetchUserReplyUpvotesData(userId);
};

exports.upvoteReply = async (userId, body) => {
  const data = { ...body, user_id: userId };
  return await createReplyUpvoteQuestionData(data);
};

exports.deleteUpvoteReply = async (userId, questionReplyId) => {
  return await deleteUpvoteReplyData(userId, questionReplyId);
};
