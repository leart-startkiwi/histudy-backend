const express = require("express");
const { authenticateToken } = require("../middleware/jwt");
const {
  handlePostRequest,
  handleGetRequest,
  handleDeleteRequest,
  handleUpdateRequest,
} = require("../services/baseController");
const {
  createAnnouncementComment,
  getAnnouncementComments,
  deleteAnnouncementComment,
  updateAnnouncementComment,
} = require("../services/announcement-comments-services");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createAnnouncementComment(req.user, req.body),
    "Failed to create announcement comment",
    req,
    res
  );
});

router.get("/:id", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getAnnouncementComments(req.params.id),
    "Failed to get announcement comments",
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => deleteAnnouncementComment(req.params.id),
    "Failed to delete announcement comment",
    res
  );
});

router.put("/:id", authenticateToken, async (req, res) => {
  await handleUpdateRequest(
    () => updateAnnouncementComment(req.params.id, req.body),
    "Failed to update announcement comment",
    req,
    res
  );
});

module.exports = router;
