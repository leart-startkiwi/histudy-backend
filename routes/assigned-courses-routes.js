const express = require("express");
const {
  handlePostRequest,
  handleGetRequest,
} = require("../services/baseController");
const {
  assignToACourse,
  getAssignedCourses,
} = require("../services/assigned-courses-services");
const { authenticateToken } = require("../middleware/jwt");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => assignToACourse(req.user, req.body),
    "Failed to assign to a course",
    req,
    res
  );
});

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getAssignedCourses(req.user.id),
    "Failed to get assigned courses",
    res
  );
});

module.exports = router;
