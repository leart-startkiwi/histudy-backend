const {
  createAnnouncementCommentData,
  fetchAnnouncementCommentsData,
  deleteAnnouncementCommentData,
  updateAnnouncementCommentData,
} = require("../data/announcement-comments-data");

exports.createAnnouncementComment = async (userData, body) => {
  const { first_name, last_name, id } = userData;
  const data = { ...body, user: { first_name, last_name, id } };
  return await createAnnouncementCommentData(data);
};

exports.getAnnouncementComments = async (announcementId) => {
  return await fetchAnnouncementCommentsData(announcementId);
};

exports.deleteAnnouncementComment = async (commentId) => {
  return await deleteAnnouncementCommentData(commentId);
};

exports.updateAnnouncementComment = async (commentId, body) => {
  return await updateAnnouncementCommentData(commentId, body);
};
