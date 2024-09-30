const db = require("../config/db");
const { dbStructure, usersProgressTable } = require("../config/dbStructure");
const UserProgressModel = require("../models/UserProgressModel");
const { handleGetDataError } = require("../services/errors");
const {
  updateData,
  createData,
  deleteData,
} = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === usersProgressTable
);

const fetchUserProgressData = async (userId, courseId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${UserProgressModel.user_id} = ? AND ${UserProgressModel.course_id} = ?`;

  const [result] = await db.query(sql, [userId, courseId]);

  return result;
};

exports.createUserProgressData = async (body) => {
  return await createData(tableName, body);
};

exports.deleteUserProgressData = async (progressId) => {
  return await deleteData(tableName, progressId);
};

exports.fetchUserProgressData = handleGetDataError(
  fetchUserProgressData,
  tableName
);
