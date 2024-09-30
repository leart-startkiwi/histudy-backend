const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/jwt");
const {
  handlePostRequest,
  handleGetRequest,
} = require("../services/baseController");
const {
  createQuestion,
  getQuestions,
} = require("../services/question-services");

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => createQuestion(req.user.id, req.body),
    "Failed to create question",
    req,
    res
  );
});

router.get("/:id", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getQuestions(req.user.id, req.params.id, req.query),
    "Failed to get questions",
    res
  );
});

module.exports = router;
