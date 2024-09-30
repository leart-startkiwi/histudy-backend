const {
  fetchCoursesData,
  fetchPopularCoursesData,
  createCourseData,
  fetchCourseData,
  fetchInstructorCoursesData,
  updateCourseData,
} = require("../data/course-data");

const multer = require("multer");

const { v4: uuidv4 } = require("uuid");
const { fetchCourseReviewsData } = require("../data/review-data");
const { fetchCourseSectionsData } = require("../data/course-sections-data");
const { fetchCourseContentsData } = require("../data/course-content-data");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/courses");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `course-${uuidv4()}-${Date.now()}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCoursePhoto = upload.array("photo", 10);

exports.getCourses = async (user, queryObj) => {
  return await fetchCoursesData(queryObj);
};

exports.getInstructorCourses = async (user) => {
  return await fetchInstructorCoursesData(user.id);
};

exports.getCourse = async (courseId) => {
  const reviews = await fetchCourseReviewsData(courseId);
  const course = await fetchCourseData(courseId);
  const sectionsData = await fetchCourseSectionsData(courseId);
  const contents = await fetchCourseContentsData(courseId);

  let sections = [];

  for (const section of sectionsData) {
    const sectionContents = contents.filter(
      (content) => content.section_id === section.id
    );

    sections.push({ ...section, contents: sectionContents });
  }

  course.first_lecture = sections?.at(0)?.contents?.at(0);
  course.reviews = reviews;
  course.sections = sections;

  return course;
};

exports.getPopularCourses = async () => {
  return await fetchPopularCoursesData();
};

exports.updateCourse = async (courseId, body) => {
  console.log(body);
  return await updateCourseData(courseId, body);
};

exports.createCourse = async (body) => {
  return await createCourseData(body);
};
