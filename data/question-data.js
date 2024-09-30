const db = require("../config/db");
const {
  dbStructure,
  questionsTable,
  usersTable,
} = require("../config/dbStructure");
const {
  convertQueryCondition,
  joinTables,
  noAmbigiousFields,
  convertToJson,
} = require("../helpers/utils");
const QuestionModel = require("../models/QuestionModel");
const UserModel = require("../models/UserModel");
const { handleGetDataError } = require("../services/errors");
const { createData } = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === questionsTable
);

const fetchQuestionsData = async (userId, courseId, queryObj) => {
  let params = [];
  params.push(courseId);

  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(tableName, QuestionModel.user_id, usersTable);

  const { queryString, queryValues } = convertQueryCondition(queryObj, [
    "content_id",
  ]);
  let sort = ``;
  let myQuestions = ``;
  let noReply = ``;

  if (queryValues.length) params.push(...queryValues);

  if (queryObj.sort_by_upvotes) {
    sort +=
      queryObj.sort_by_upvotes === "desc"
        ? `ORDER BY upvote_count DESC`
        : `ORDER BY upvote_count ASC`;
  } else if (queryObj.sort_by_date) {
    sort +=
      queryObj.sort_by_date === "desc"
        ? `ORDER BY created_at DESC`
        : `ORDER BY created_at ASC`;
  }

  if (queryObj.my_questions) {
    myQuestions += ` AND ${tableName}.${QuestionModel.user_id} = ?`;
    params.push(userId);
  }

  if (queryObj.no_replies) {
    noReply += ` AND question_replies.question_id IS NULL`;
  }

  const upvotesCount = `(SELECT COUNT(upvotes.question_id) FROM upvotes WHERE upvotes.question_id = ${tableName}.id) AS upvote_count`;

  const repliesCount = `(SELECT COUNT(question_replies.question_id) FROM question_replies WHERE question_replies.question_id = ${tableName}.id) AS replies_count`;

  const sql = `SELECT ${noAmbigiousFields(
    tableName,
    defaultFields
  )}, ${user_json_object}, ${tableName}.created_at , ${upvotesCount}, ${repliesCount} FROM ${tableName} ${userJoin} ${joinTables(
    tableName,
    "id",
    "upvotes",
    "question_id",
    "LEFT"
  )} ${joinTables(
    tableName,
    "id",
    "question_replies",
    "question_id",
    "LEFT"
  )} WHERE ${QuestionModel.course_id} = ? ${
    queryString.length ? "AND" : ""
  } ${queryString} ${myQuestions} ${noReply} GROUP BY questions.id ${sort}`;

  const [result] = await db.query(sql, params);

  return result;
};

exports.createQuestionData = async (body) => {
  return await createData(tableName, body);
};

module.exports.fetchQuestionsData = handleGetDataError(
  fetchQuestionsData,
  tableName
);
