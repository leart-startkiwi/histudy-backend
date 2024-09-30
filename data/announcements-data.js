const Announcement = require("../models/AnnouncementModel");

exports.createAnnouncementData = async (body) => {
  const newAnnouncement = await Announcement.create(body);
  return newAnnouncement;
};

exports.fetchAnnouncementsData = async (courseId) => {
  const announcements = await Announcement.find({ course_id: courseId }).sort({
    createdAt: -1,
  });
  return announcements;
};
