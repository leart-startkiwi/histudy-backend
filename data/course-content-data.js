const db = require("../config/db");
const {
  dbStructure,
  courseContentsTable,
  courseSectionsTable,
} = require("../config/dbStructure");
const { joinTables } = require("../helpers/utils");
const CourseContentModel = require("../models/CourseContentModel");
const CourseSectionModel = require("../models/CourseSectionModel");
const { handleGetDataError } = require("../services/errors");
const {
  deleteData,
  createData,
  updateData,
  fetchOneRecordData,
} = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === courseContentsTable
);

const fetchCourseContentsData = async (courseId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${CourseContentModel.course_id} = ? ORDER BY ${CourseContentModel.position} ASC`;

  const [result] = await db.query(sql, courseId);

  return result;
};

const fetchFirstCourseLectureData = async (courseId) => {
  const sectionsJoin = joinTables(
    tableName,
    CourseContentModel.section_id,
    courseSectionsTable
  );

  const sql = `SELECT ${tableName}.id FROM ${tableName} ${sectionsJoin} WHERE ${tableName}.${CourseContentModel.course_id} = ? ORDER BY ${courseSectionsTable}.${CourseSectionModel.position}, ${tableName}.${CourseContentModel.position} LIMIT 1`;

  const [result] = await db.query(sql, courseId);

  return result;
};

exports.fetchCourseContentData = async (contentId) => {
  return await fetchOneRecordData(tableName, contentId);
};

exports.updateCourseContentData = async (contentId, body) => {
  return await updateData(tableName, contentId, body);
};

exports.createCourseContentData = async (body) => {
  return await createData(tableName, body);
};

exports.deleteCourseContentData = async (contentId) => {
  return await deleteData(tableName, contentId);
};

module.exports.fetchCourseContentsData = handleGetDataError(
  fetchCourseContentsData,
  tableName
);

module.exports.fetchFirstCourseLectureData = handleGetDataError(
  fetchFirstCourseLectureData,
  tableName
);
