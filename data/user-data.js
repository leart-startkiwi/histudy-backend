const db = require("../config/db");
const {
  handleCreateDataError,
  handleGetDataError,
} = require("../services/errors");
const { dbStructure, usersTable } = require("../config/dbStructure");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const { v4: uuidv4 } = require("uuid");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === usersTable
);

const fetchUser = async ({ key = "id", value = "" } = {}) => {
  const sql = `SELECT * FROM ${tableName} WHERE ${UserModel[key]} = ?`;

  const [result] = await db.query(sql, value);

  return result[0];
};

exports.createUser = async (body) => {
  const { password, ...bodyWithoutPassword } = body;
  const userId = uuidv4();

  const hashedPassword = await bcrypt.hash(password, 10);

  const fields = Object.keys(bodyWithoutPassword);
  const values = Object.values(bodyWithoutPassword);
  const placeholders = values.map((value) => "?");

  const sql = `INSERT INTO ${tableName} (${[
    ...fields,
    UserModel.id,
    UserModel.password,
  ]}) VALUES (${placeholders}, ?, ?)`;

  const [result] = await db.query(sql, [...values, userId, hashedPassword]);

  const [data] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
    result.insertId,
  ]);

  return data[0];
};

const fetchUsersFullNameData = async (id) => {
  const sql = `SELECT id, ${UserModel.first_name}, ${UserModel.last_name} FROM ${tableName} WHERE id IN (?)`;

  const [result] = await db.query(sql, id);

  return result[0];
};

module.exports.fetchUser = handleGetDataError(fetchUser, tableName);
module.exports.fetchUsersFullNameData = handleGetDataError(
  fetchUsersFullNameData,
  tableName
);
// module.exports.createUser = handleCreateDataError(createUser, tableName);
