const express = require("express");
const {
  handleGetRequest,
  handlePostRequest,
  handleGetOneRequest,
  handleUpdateRequest,
} = require("../services/baseController");
const {
  getCourses,
  getPopularCourses,
  createCourse,
  uploadCoursePhoto,
  getCourse,
  getInstructorCourses,
  updateCourse,
} = require("../services/course-services");
const router = express.Router();

const { authenticateToken } = require("../middleware/jwt");

router.get("/", async (req, res) => {
  await handleGetRequest(
    () => getCourses(req.user, req.query),
    "Failed to get courses",
    res
  );
});

router.get("/popular", async (req, res) => {
  await handleGetRequest(
    getPopularCourses,
    "Failed to get popular courses",
    res
  );
});

router.get("/instructor", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getInstructorCourses(req.user),
    "Failed to get instructor courses",
    res
  );
});

router.get("/:id", async (req, res) => {
  await handleGetOneRequest(
    () => getCourse(req.params.id),
    "Failed to get course",
    res
  );
});

router.post("/", authenticateToken, uploadCoursePhoto, async (req, res) => {
  await handlePostRequest(
    () => createCourse({ ...req.body, user_id: req.user.id }),
    "Failed to create course",
    req,
    res,
    { field: "image", path: "/img/courses/" }
  );
});

router.put("/:id", authenticateToken, uploadCoursePhoto, async (req, res) => {
  await handleUpdateRequest(
    () => updateCourse(req.params.id, req.body),
    "Failed to update course",
    req,
    res,
    { field: "image", path: "/img/courses/" }
  );
});

module.exports = router;
