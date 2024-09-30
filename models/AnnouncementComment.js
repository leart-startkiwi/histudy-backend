const mongoose = require("mongoose");

const announcementCommentSchema = new mongoose.Schema(
  {
    comment: String,
    announcement_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
    },
    user: Object,
  },
  { timestamps: true }
);

const AnnouncementComment = mongoose.model(
  "Announcement-Comment",
  announcementCommentSchema
);

module.exports = AnnouncementComment;
