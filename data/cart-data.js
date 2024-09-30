const db = require("../config/db");
const {
  dbStructure,
  cartsTable,
  coursesTable,
  usersTable,
} = require("../config/dbStructure");
const { convertToJson, joinTables } = require("../helpers/utils");
const CartModel = require("../models/CartModel");
const CourseModel = require("../models/CourseModel");
const UserModel = require("../models/UserModel");
const { handleGetDataError } = require("../services/errors");
const { createData, deleteData } = require("./baseQueries/baseQueries");
const { deleteLikeData } = require("./like-data");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === cartsTable
);

const nonAmbigiousFields = defaultFields.map(
  (field) => `${tableName}.${field}`
);

const getCartData = async (userId) => {
  const { id, name, user_id, price, image } = CourseModel;

  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(tableName, CourseModel.user_id, usersTable);

  const courseId = `${coursesTable}.${id}`;
  const courseName = `${coursesTable}.${name}`;
  const courseTeacher = `${coursesTable}.${user_id}`;
  const coursePrice = `${coursesTable}.${price}`;
  const courseImage = `${coursesTable}.${image}`;

  const json_object = `'id', ${courseId}, 'name', ${courseName}, 'user_id', ${courseTeacher}, 'price', ${coursePrice}, 'image', ${courseImage}`;

  const sql = `SELECT ${nonAmbigiousFields}, JSON_OBJECT(${json_object}) AS course, ${user_json_object} FROM ${tableName} ${userJoin} INNER JOIN ${coursesTable} ON ${CartModel.course_id} = ${coursesTable}.${CourseModel.id} WHERE ${cartsTable}.${CartModel.user_id} = ?`;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.createCartData = async (body) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await deleteLikeData(body.user_id, body.course_id, connection);

    const newCartItem = await createData(tableName, body, connection);

    await connection.commit();
    return newCartItem;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.deleteCartData = async (key, connection = db) => {
  return await deleteData(tableName, key, connection);
};

module.exports.getCartData = handleGetDataError(getCartData, tableName);
