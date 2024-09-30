const {
  updateCourseSectionsData,
  deleteCourseSectionData,
  createCourseSectionData,
} = require("../data/course-sections-data");

exports.updateCourseSections = async (sectionId, body) => {
  return await updateCourseSectionsData(sectionId, body);
};

exports.deleteCourseSection = async (sectionId) => {
  return await deleteCourseSectionData(sectionId);
};

exports.createCourseSection = async (body) => {
  return await createCourseSectionData(body);
};
