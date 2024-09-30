const db = require("../config/db");
const {
  coursesAssignedTable,
  dbStructure,
  coursesTable,
  courseContentsTable,
  usersProgressTable,
  usersTable,
} = require("../config/dbStructure");
const {
  joinTables,
  convertToJson,
  noAmbigiousFields,
} = require("../helpers/utils");
const CartModel = require("../models/CartModel");
const CourseContentModel = require("../models/CourseContentModel");
const CourseModel = require("../models/CourseModel");
const CoursesAssignedModel = require("../models/CoursesAssignedModel");
const UserModel = require("../models/UserModel");
const UserProgressModel = require("../models/UserProgressModel");
const { handleGetDataError } = require("../services/errors");
const { createData, fetchOneRecordData } = require("./baseQueries/baseQueries");
const { deleteCartData } = require("./cart-data");
const { deleteLikeData } = require("./like-data");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === coursesAssignedTable
);

exports.fetchAssignedCourse = async (key) => {
  return await fetchOneRecordData(tableName, key);
};

const fetchAssignedCourses = async (userId) => {
  const course_json_object = convertToJson(
    coursesTable,
    [CourseModel.name, CourseModel.image],
    "course"
  );

  const courseJoin = joinTables(
    tableName,
    CoursesAssignedModel.course_id,
    coursesTable
  );

  const contentCount = `(SELECT COUNT(*) FROM ${courseContentsTable} WHERE ${courseContentsTable}.${CourseContentModel.course_id} = ${coursesTable}.id) AS content_count`;
  const progressCount = `(SELECT COUNT(*) FROM ${usersProgressTable} WHERE ${usersProgressTable}.${UserProgressModel.user_id} = ${tableName}.${CoursesAssignedModel.user_id} AND ${usersProgressTable}.${UserProgressModel.course_id} = ${tableName}.${CoursesAssignedModel.course_id}) AS progress_count`;

  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(tableName, CourseModel.user_id, usersTable);

  const sql = `SELECT ${noAmbigiousFields(
    tableName,
    defaultFields
  )}, ${course_json_object}, ${contentCount}, ${progressCount}, ${user_json_object} FROM ${tableName} ${courseJoin} ${userJoin} WHERE ${tableName}.${
    CoursesAssignedModel.user_id
  } = ?`;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.createAssignedCourseData = async (body) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await deleteLikeData(body.user_id, body.course_id, connection);

    await deleteCartData(
      {
        [CartModel.user_id]: body.user_id,
        [CartModel.course_id]: body.course_id,
      },
      connection
    );

    const assignedCourse = await createData(tableName, body, connection);

    await connection.commit();

    return assignedCourse;
  } catch (error) {
    console.error("Transaction error: ", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports.fetchAssignedCourses = handleGetDataError(
  fetchAssignedCourses,
  tableName
);
