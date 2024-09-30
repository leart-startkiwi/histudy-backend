const db = require("../config/db");
const { dbStructure, replyUpvotesTable } = require("../config/dbStructure");
const ReplyUpvoteModel = require("../models/ReplyUpvoteModel");
const { handleGetDataError } = require("../services/errors");
const { deleteData, createData } = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === replyUpvotesTable
);

const fetchUserReplyUpvotesData = async (userId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${ReplyUpvoteModel.user_id} = ? `;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.createReplyUpvoteQuestionData = async (body) => {
  return await createData(tableName, body);
};

exports.deleteUpvoteReplyData = async (userId, questionReplyId) => {
  return await deleteData(tableName, {
    user_id: userId,
    question_reply_id: questionReplyId,
  });
};

module.exports.fetchUserReplyUpvotesData = handleGetDataError(
  fetchUserReplyUpvotesData,
  tableName
);
