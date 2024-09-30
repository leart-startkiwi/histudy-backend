const {
  createLikeData,
  fetchLikedCoursesIds,
  deleteLikeData,
} = require("../data/like-data");

exports.likeCourse = async (user, body) => {
  const data = { user_id: user.id, course_id: body.course_id };
  return await createLikeData(data);
};

exports.getLikedCourses = async (userId) => {
  return await fetchLikedCoursesIds(userId);
};

exports.unlikeCourse = async (userId, courseId) => {
  return await deleteLikeData(userId, courseId);
};
