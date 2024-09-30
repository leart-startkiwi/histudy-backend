const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/jwt");
const {
  handleGetRequest,
  handlePostRequest,
  handleDeleteRequest,
} = require("../services/baseController");
const {
  getUserUpvotes,
  upvoteQuestion,
  deleteUpvoteQuestion,
} = require("../services/upvote-services");

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getUserUpvotes(req.user.id),
    "Failed to get question upvotes",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => upvoteQuestion(req.user.id, req.body),
    "Failed to upvote question",
    req,
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => deleteUpvoteQuestion(req.user.id, req.params.id),
    "Failed to delete question upvote",
    res
  );
});

module.exports = router;
