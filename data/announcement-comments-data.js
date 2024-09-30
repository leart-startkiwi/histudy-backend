const AnnouncementComment = require("../models/AnnouncementComment");

exports.createAnnouncementCommentData = async (body) => {
  const newAnnouncementComment = await AnnouncementComment.create(body);
  return newAnnouncementComment;
};

exports.fetchAnnouncementCommentsData = async (announcementId) => {
  const announcementComments = await AnnouncementComment.find({
    announcement_id: announcementId,
  }).sort({
    createdAt: -1,
  });
  return announcementComments;
};

exports.fetchAnnouncementCommentCountData = async (announcementId) => {
  const count = await AnnouncementComment.countDocuments({
    announcement_id: announcementId,
  });
  return count;
};

exports.deleteAnnouncementCommentData = async (commentId) => {
  const deletedComment = await AnnouncementComment.findByIdAndDelete(commentId);
  return deletedComment;
};

exports.updateAnnouncementCommentData = async (commentId, body) => {
  const newComment = await AnnouncementComment.findByIdAndUpdate(
    commentId,
    body,
    { new: true, runValidators: true }
  );

  return newComment;
};
