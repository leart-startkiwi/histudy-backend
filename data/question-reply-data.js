const db = require("../config/db");
const {
  dbStructure,
  questionRepliesTable,
  usersTable,
} = require("../config/dbStructure");
const {
  convertToJson,
  joinTables,
  noAmbigiousFields,
} = require("../helpers/utils");
const QuestionReplyModel = require("../models/QuestionReplyModel");
const UserModel = require("../models/UserModel");
const { handleGetDataError } = require("../services/errors");
const { createData } = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === questionRepliesTable
);

const fetchQuestionRepliesData = async (questionId) => {
  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(
    tableName,
    QuestionReplyModel.user_id,
    usersTable
  );

  const upvotesCount = `(SELECT COUNT(replies_upvotes.question_reply_id) FROM replies_upvotes WHERE replies_upvotes.question_reply_id = ${tableName}.id) AS upvote_count`;

  const sql = `SELECT ${noAmbigiousFields(
    tableName,
    defaultFields
  )}, ${user_json_object}, ${tableName}.created_at, ${upvotesCount} FROM ${tableName} ${userJoin} WHERE ${
    QuestionReplyModel.question_id
  } = ? GROUP BY ${tableName}.id ORDER BY upvote_count DESC `;

  const [result] = await db.query(sql, questionId);

  return result;
};

exports.createReplyData = async (body) => {
  return await createData(tableName, body);
};

module.exports.fetchQuestionRepliesData = handleGetDataError(
  fetchQuestionRepliesData,
  tableName
);
