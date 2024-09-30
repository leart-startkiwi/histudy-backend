const {
  createUserProgressData,
  fetchUserProgressData,
  deleteUserProgressData,
} = require("../data/user-progress-data");

exports.getUserProgress = async (userId, courseId) => {
  return await fetchUserProgressData(userId, courseId);
};

exports.deleteUserProgress = async (progressId) => {
  return await deleteUserProgressData(progressId);
};

exports.createUserProgress = async (user, body) => {
  const data = { ...body, user_id: user.id };
  return await createUserProgressData(data);
};
