const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
  deleteCourseContentData,
  createCourseContentData,
  updateCourseContentData,
  fetchCourseContentData,
  fetchFirstCourseLectureData,
} = require("../data/course-content-data");
const fs = require("fs");
const path = require("path");
const { extractVideoDuration } = require("../helpers/utils");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos/contents");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `content-${uuidv4()}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

exports.uploadCourseContent = upload.single("content");

exports.createCourseContent = async (body) => {
  return await createCourseContentData(body);
};

exports.getFirstCourseContent = async (courseId) => {
  return await fetchFirstCourseLectureData(courseId);
};

exports.updateCourseContent = async (file, contentId, body) => {
  const content = await fetchCourseContentData(contentId);

  if (content.path && file) {
    fs.unlink(
      path.join(
        __dirname,
        "..",
        "public/videos/contents",
        content.path.split("/").slice(5, content.path.length).join("")
      ),
      (err) => {
        if (err) console.error("Failed to delete file...", err);
      }
    );
  }

  let videoDuration = null;
  if (file && body.content_type === "video") {
    videoDuration = await extractVideoDuration(file.path);
  }

  if (videoDuration) {
    body.duration = videoDuration;
  }

  return await updateCourseContentData(contentId, body);
};

exports.deleteCourseContent = async (contentId) => {
  return await deleteCourseContentData(contentId);
};
