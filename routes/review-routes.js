const express = require("express");
const {
  leaveReview,
  removeReview,
  editReview,
  getOwnReview,
  getMyReviews,
} = require("../services/review-services");
const {
  handlePostRequest,
  handleDeleteRequest,
  handleUpdateRequest,
  handleGetOneRequest,
  handleGetRequest,
} = require("../services/baseController");
const { authenticateToken } = require("../middleware/jwt");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => leaveReview(req.user, req.body, res),
    "Failed to leave a review",
    req,
    res
  );
});

router.get("/:id", authenticateToken, async (req, res) => {
  await handleGetOneRequest(
    () => getOwnReview(req.user.id, req.params.id),
    "Failed to get own review",
    res
  );
});

router.put("/:id", authenticateToken, async (req, res) => {
  await handleUpdateRequest(
    () => editReview(req.params.id, req.body),
    "Failed to update the review",
    req,
    res
  );
});

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getMyReviews(req.user.id),
    "Failed to get my own reviews",
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => removeReview(req.params.id),
    "Failed to delete review",
    res
  );
});

module.exports = router;
