const {
  fetchQuestionRepliesData,
  createReplyData,
} = require("../data/question-reply-data");

exports.getQuestionReplies = async (questionId) => {
  return await fetchQuestionRepliesData(questionId);
};

exports.createReply = async (userId, body) => {
  const data = { ...body, user_id: userId };
  return await createReplyData(data);
};
