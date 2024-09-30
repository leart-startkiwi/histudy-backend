const express = require("express");
const { authenticateToken } = require("../middleware/jwt");
const {
  handleUpdateRequest,
  handleDeleteRequest,
  handlePostRequest,
} = require("../services/baseController");
const {
  updateCourseSections,
  deleteCourseSection,
  createCourseSection,
} = require("../services/course-section-services");

const router = express.Router();

router.put("/:id", authenticateToken, async (req, res) => {
  await handleUpdateRequest(
    () => updateCourseSections(req.params.id, req.body),
    "Failed to update course section",
    req,
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => deleteCourseSection(req.params.id),
    "Failed to delete course section",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createCourseSection(req.body),
    "Failed to create course section",
    req,
    res
  );
});

module.exports = router;
