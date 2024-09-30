const db = require("../config/db");
const {
  createData,
  deleteData,
  updateData,
  fetchOneRecordData,
} = require("./baseQueries/baseQueries");
const {
  dbStructure,
  reviewsTable,
  usersTable,
} = require("../config/dbStructure");
const ReviewModel = require("../models/ReviewModel");
const { handleGetDataError } = require("../services/errors");
const {
  convertToJson,
  noAmbigiousFields,
  joinTables,
} = require("../helpers/utils");
const UserModel = require("../models/UserModel");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === reviewsTable
);

const fetchCourseReviewsData = async (courseId) => {
  const { id, review, rating } = ReviewModel;
  const nonAmbigiousFields = noAmbigiousFields(tableName, [
    id,
    review,
    rating,
    "created_at",
  ]);

  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );

  const usersJoin = joinTables(reviewsTable, ReviewModel.user_id, usersTable);

  const sql = `SELECT ${nonAmbigiousFields}, ${user_json_object} FROM ${tableName} ${usersJoin} WHERE ${ReviewModel.course_id} = ?`;

  const [result] = await db.query(sql, courseId);

  return result;
};

exports.fetchOwnReviewData = async (userId, courseId) => {
  return await fetchOneRecordData(tableName, {
    user_id: userId,
    course_id: courseId,
  });
};

const fetchMyReviewsData = async (userId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${ReviewModel.user_id} = ?`;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.createReviewData = async (body) => {
  return await createData(tableName, body);
};

exports.updateReviewData = async (reviewId, body) => {
  return await updateData(tableName, reviewId, body);
};

exports.deleteReviewData = async (key) => {
  return await deleteData(tableName, key);
};

module.exports.fetchCourseReviewsData = handleGetDataError(
  fetchCourseReviewsData,
  tableName
);

module.exports.fetchMyReviewsData = handleGetDataError(
  fetchMyReviewsData,
  tableName
);
