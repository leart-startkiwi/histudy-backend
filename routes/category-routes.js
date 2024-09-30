const express = require("express");
const {
  getCategories,
  deleteCategory,
} = require("../services/category-services");
const {
  handleGetRequest,
  handleDeleteRequest,
} = require("../services/baseController");
const router = express.Router();

router.get("/", async (req, res) => {
  await handleGetRequest(getCategories, "Failed to get categories", res);
});

router.delete("/:id", async (req, res) => {
  await handleDeleteRequest(
    () => deleteCategory(req.params.id),
    "Failed to delete a category",
    res
  );
});

module.exports = router;
