const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    content: Object,
    course_id: Number,
    user: Object,
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
