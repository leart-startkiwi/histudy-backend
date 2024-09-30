const express = require("express");
const { authenticateToken } = require("../middleware/jwt");
const {
  handlePostRequest,
  handleGetRequest,
  handleDeleteRequest,
} = require("../services/baseController");
const {
  createUserProgress,
  getUserProgress,
  deleteUserProgress,
} = require("../services/user-progress-services");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createUserProgress(req.user, req.body),
    "Failed to create user progress",
    req,
    res
  );
});

router.get("/:courseId", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getUserProgress(req.user.id, req.params.courseId),
    "Failed to get user progress",
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => deleteUserProgress(req.params.id),
    "Failed to delete user progress",
    res
  );
});

module.exports = router;
