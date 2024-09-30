const {
  fetchAnnouncementCommentCountData,
} = require("../data/announcement-comments-data");
const {
  createAnnouncementData,
  fetchAnnouncementsData,
} = require("../data/announcements-data");

exports.createAnnouncement = async (userData, body) => {
  const { first_name, last_name, id } = userData;
  const data = { ...body, user: { first_name, last_name, id } };
  return await createAnnouncementData(data);
};

exports.getAnnouncements = async (courseId) => {
  const announcements = await fetchAnnouncementsData(courseId);

  for (let i = 0; i < announcements.length; i++) {
    announcements[i] = announcements[i].toObject();
    const count = await fetchAnnouncementCommentCountData(announcements[i]._id);
    announcements[i].comments_count = count;
  }

  return announcements;
};
