const express = require("express");
const { authenticateToken } = require("../middleware/jwt");
const {
  handleDeleteRequest,
  handlePostRequest,
  handleUpdateRequest,
  handleGetOneRequest,
  handleGetRequest,
} = require("../services/baseController");
const {
  deleteCourseContent,
  createCourseContent,
  updateCourseContent,
  uploadCourseContent,
  getFirstCourseContent,
} = require("../services/course-content-services");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  return await handlePostRequest(
    () => createCourseContent(req.body),
    "Failed to create course content",
    req,
    res
  );
});

router.get("/:id", async (req, res) => {
  return await handleGetRequest(
    () => getFirstCourseContent(req.params.id),
    "Failed to get first course content",
    res
  );
});

router.put("/:id", authenticateToken, uploadCourseContent, async (req, res) => {
  await handleUpdateRequest(
    () => updateCourseContent(req.file, req.params.id, req.body),
    "Failed to update course content",
    req,
    res,
    null,
    { field: "path", path: "/videos/contents/" }
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  return await handleDeleteRequest(
    () => deleteCourseContent(req.params.id),
    "Failed to delete course content",
    res
  );
});

module.exports = router;
