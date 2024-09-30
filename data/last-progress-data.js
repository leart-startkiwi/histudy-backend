const db = require("../config/db");
const { dbStructure, lastProgressTable } = require("../config/dbStructure");
const LastProgressModel = require("../models/LastProgressModel");
const {
  fetchOneRecordData,
  createData,
  updateData,
} = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === lastProgressTable
);

exports.fetchLastUserProgressData = async (userId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${LastProgressModel.user_id} = ?`;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.updateLastProgressData = async (id, body) => {
  return await updateData(tableName, id, body);
};

exports.createLastUserProgressData = async (body) => {
  return await createData(tableName, body);
};
