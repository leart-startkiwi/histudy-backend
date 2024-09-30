const {
  createAssignedCourseData,
  fetchAssignedCourses,
} = require("../data/assigned-courses-data");

exports.assignToACourse = async (user, body) => {
  const data = { user_id: user.id, course_id: body.course_id };
  return await createAssignedCourseData(data);
};

exports.getAssignedCourses = async (userId) => {
  return await fetchAssignedCourses(userId);
};
