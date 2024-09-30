const db = require("../config/db");
const {
  dbStructure,
  likesTable,
  coursesTable,
  usersTable,
} = require("../config/dbStructure");
const { convertToJson, joinTables } = require("../helpers/utils");
const CourseModel = require("../models/CourseModel");
const LikeModel = require("../models/LikeModel");
const UserModel = require("../models/UserModel");
const { handleGetDataError } = require("../services/errors");
const { createData, deleteData } = require("./baseQueries/baseQueries");

const { tableName } = dbStructure.find(
  (structure) => structure.tableName === likesTable
);

const fetchLikedCoursesIds = async (userId) => {
  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(tableName, CourseModel.user_id, usersTable);

  const sql = `SELECT ${LikeModel.course_id}, ${CourseModel.name}, ${coursesTable}.${CourseModel.user_id}, ${CourseModel.image}, ${CourseModel.price}, ${user_json_object} FROM ${tableName} ${userJoin} INNER JOIN ${coursesTable} ON ${LikeModel.course_id} = ${coursesTable}.id WHERE ${tableName}.${LikeModel.user_id} = ?`;

  const [result] = await db.query(sql, userId);

  const courseIds = result.map((result) => result.course_id);

  return { courseIds, likedCourses: result };
};

exports.createLikeData = async (body) => {
  return await createData(tableName, body);
};

exports.deleteLikeData = async (userId, courseId, connection = db) => {
  return await deleteData(
    tableName,
    {
      [LikeModel.user_id]: userId,
      [LikeModel.course_id]: courseId,
    },
    connection
  );
};

module.exports.fetchLikedCoursesIds = handleGetDataError(
  fetchLikedCoursesIds,
  tableName
);
