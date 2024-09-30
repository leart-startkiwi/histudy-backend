const express = require("express");
const {
  handlePostRequest,
  handleGetRequest,
} = require("../services/baseController");
const {
  createAnnouncement,
  getAnnouncements,
} = require("../services/announcements-services");
const { authenticateToken } = require("../middleware/jwt");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createAnnouncement(req.user, req.body),
    "Failed to create announcement",
    req,
    res
  );
});

router.get("/:id", async (req, res) => {
  await handleGetRequest(
    () => getAnnouncements(req.params.id),
    "Failed to get announcements,res",
    res
  );
});

module.exports = router;
