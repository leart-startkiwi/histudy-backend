const express = require("express");
const { authenticateToken } = require("../middleware/jwt");
const {
  handleGetOneRequest,
  handlePostRequest,
  handleUpdateRequest,
  handleGetRequest,
} = require("../services/baseController");
const {
  getLastUserProgress,
  createLastUserProgress,
  updateLastProgress,
} = require("../services/last-progress-services");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getLastUserProgress(req.user.id),
    "Failed to get last user progress",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createLastUserProgress(req.user.id, req.body),
    "Failed to create last user progress",
    req,
    res
  );
});

router.put("/:id", authenticateToken, async (req, res) => {
  await handleUpdateRequest(
    () => updateLastProgress(req.params.id, req.body),
    "Failed to update last progress",
    req,
    res
  );
});

module.exports = router;
