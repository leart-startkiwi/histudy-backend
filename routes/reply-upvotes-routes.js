const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/jwt");
const {
  handleGetRequest,
  handlePostRequest,
  handleDeleteRequest,
} = require("../services/baseController");
const {
  getReplyUpvotes,
  upvoteReply,
  deleteUpvoteReply,
} = require("../services/reply-upvote-services");

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getReplyUpvotes(req.user.id),
    "Failed to get reply upvotes",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => upvoteReply(req.user.id, req.body),
    "Failed to upvote reply",
    req,
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => deleteUpvoteReply(req.user.id, req.params.id),
    "Failed to delete reply upvote",
    res
  );
});

module.exports = router;
