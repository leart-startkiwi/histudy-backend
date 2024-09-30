const express = require("express");
const {
  handleGetRequest,
  handleUpdateRequest,
} = require("../services/baseController");
const { authenticateToken } = require("../middleware/jwt");
const {
  getChat,
  getAllMyChats,
  markMessageAsRead,
} = require("../services/chat-services");

const router = express.Router();

router.get("/:id", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getChat(req.user.id, req.params.id),
    "Failed to get chat with user",
    res
  );
});

router.put("/:id", authenticateToken, async (req, res) => {
  await handleUpdateRequest(
    () => markMessageAsRead(req.user.id, req.params.id),
    "Failed to mark message as read",
    req,
    res
  );
});

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getAllMyChats(req.user.id),
    "Failed to get my chats",
    res
  );
});

module.exports = router;
