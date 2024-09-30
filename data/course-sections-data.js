const db = require("../config/db");
const { dbStructure, courseSectionsTable } = require("../config/dbStructure");
const CourseSectionModel = require("../models/CourseSectionModel");
const { handleGetDataError } = require("../services/errors");
const {
  updateData,
  deleteData,
  createData,
} = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === courseSectionsTable
);

const fetchCourseSectionsData = async (courseId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${CourseSectionModel.course_id} = ? ORDER BY ${CourseSectionModel.position} ASC`;

  const [result] = await db.query(sql, courseId);

  return result;
};

exports.createCourseSectionData = async (body) => {
  return await createData(tableName, body);
};

exports.updateCourseSectionsData = async (sectionId, body) => {
  return await updateData(tableName, sectionId, body);
};

exports.deleteCourseSectionData = async (sectionId) => {
  return await deleteData(tableName, sectionId);
};

module.exports.fetchCourseSectionsData = handleGetDataError(
  fetchCourseSectionsData,
  tableName
);
