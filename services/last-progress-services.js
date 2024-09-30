const {
  fetchLastUserProgressData,
  createLastUserProgressData,
  updateLastProgressData,
} = require("../data/last-progress-data");

exports.getLastUserProgress = async (userId) => {
  return await fetchLastUserProgressData(userId);
};

exports.updateLastProgress = async (id, body) => {
  return await updateLastProgressData(id, body);
};

exports.createLastUserProgress = async (userId, body) => {
  const data = { ...body, user_id: userId };
  return await createLastUserProgressData(data);
};
