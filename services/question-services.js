const {
  createQuestionData,
  fetchQuestionsData,
} = require("../data/question-data");

exports.createQuestion = async (userId, body) => {
  const data = { ...body, user_id: userId };
  return await createQuestionData(data);
};

exports.getQuestions = async (userId, courseId, queryObj) => {
  return await fetchQuestionsData(userId, courseId, queryObj);
};
