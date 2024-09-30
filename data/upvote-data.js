const db = require("../config/db");
const { dbStructure, upvotesTable } = require("../config/dbStructure");
const QuestionUpvoteModel = require("../models/QuestionUpvoteModel");
const { handleGetDataError } = require("../services/errors");
const { createData, deleteData } = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === upvotesTable
);

const fetchUserUpvotesData = async (userId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${QuestionUpvoteModel.user_id} = ? `;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.createUpvoteQuestionData = async (body) => {
  return await createData(tableName, body);
};

exports.deleteUpvoteQuestionData = async (userId, questionId) => {
  return await deleteData(tableName, {
    user_id: userId,
    question_id: questionId,
  });
};

module.exports.fetchUserUpvotesData = handleGetDataError(
  fetchUserUpvotesData,
  tableName
);
