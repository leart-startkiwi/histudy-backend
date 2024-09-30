const {
  fetchUserUpvotesData,
  createUpvoteQuestionData,
  deleteUpvoteQuestionData,
} = require("../data/upvote-data");

exports.getUserUpvotes = async (userId) => {
  return await fetchUserUpvotesData(userId);
};

exports.upvoteQuestion = async (userId, body) => {
  const data = { ...body, user_id: userId };
  return await createUpvoteQuestionData(data);
};

exports.deleteUpvoteQuestion = async (userId, questionId) => {
  return await deleteUpvoteQuestionData(userId, questionId);
};
