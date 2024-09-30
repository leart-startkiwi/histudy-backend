const { coursesAssignedTable } = require("../config/dbStructure");
const { fetchAssignedCourse } = require("../data/assigned-courses-data");
const {
  createReviewData,
  deleteReviewData,
  updateReviewData,
  fetchOwnReviewData,
  fetchMyReviewsData,
} = require("../data/review-data");
const CoursesAssignedModel = require("../models/CoursesAssignedModel");

exports.leaveReview = async (user, body, res) => {
  const assignedCourse = await fetchAssignedCourse({
    [CoursesAssignedModel.user_id]: user.id,
    [CoursesAssignedModel.course_id]: body.course_id,
  });

  const data = { ...body, user_id: user.id };

  if (assignedCourse) {
    return await createReviewData(data);
  } else {
    return res.status(403).json({
      status: "fail",
      message: "You are not enrolled to this course to leave a review",
    });
  }
};

exports.getOwnReview = async (userId, courseId) => {
  return await fetchOwnReviewData(userId, courseId);
};

exports.getMyReviews = async (userId) => {
  return await fetchMyReviewsData(userId);
};

exports.editReview = async (reviewId, body) => {
  const { review, rating } = body;
  return await updateReviewData(reviewId, { review, rating });
};

exports.removeReview = async (reviewId) => {
  return await deleteReviewData(reviewId);
};
