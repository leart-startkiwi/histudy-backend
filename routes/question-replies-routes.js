const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/jwt");
const {
  handleGetRequest,
  handlePostRequest,
} = require("../services/baseController");
const {
  getQuestionReplies,
  createReply,
} = require("../services/question-reply-services");

router.get("/:id", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getQuestionReplies(req.params.id),
    "Faield to get question replies",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createReply(req.user.id, req.body),
    "Failed to create reply",
    req,
    res
  );
});

module.exports = router;
