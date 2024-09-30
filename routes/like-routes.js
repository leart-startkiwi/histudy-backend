const express = require("express");
const {
  handlePostRequest,
  handleGetRequest,
  handleDeleteRequest,
} = require("../services/baseController");
const {
  likeCourse,
  getLikedCourses,
  unlikeCourse,
} = require("../services/like-services");
const { authenticateToken } = require("../middleware/jwt");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getLikedCourses(req.user.id),
    "Failed to get liked courses",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => likeCourse(req.user, req.body),
    "Failed to like course",
    req,
    res
  );
});

router.delete("/", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => unlikeCourse(req.user.id, req.body.course_id),
    "Failed to unlike course",
    res
  );
});

module.exports = router;
