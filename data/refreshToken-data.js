const db = require("../config/db");
const { dbStructure, refreshTokensTable } = require("../config/dbStructure");
const RefreshTokenModel = require("../models/RefreshTokenModel");
const {
  handleCreateDataError,
  handleGetDataError,
  handleDeleteDataError,
} = require("../services/errors");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === refreshTokensTable
);

const createRefreshTokenData = async (userId, token) => {
  const sql = `INSERT INTO ${tableName} (${RefreshTokenModel.user_id}, ${RefreshTokenModel.token}) VALUES (?, ?)`;

  const [result] = await db.query(sql, [userId, token]);

  const [data] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
    result.insertId,
  ]);

  return data[0];
};

const fetchRefreshTokenData = async (userId) => {
  const sql = `SELECT ${RefreshTokenModel.token} FROM ${tableName} WHERE ${RefreshTokenModel.user_id} = ?`;

  const [result] = await db.query(sql, userId);

  return result[0];
};

const deleteRefreshTokenData = async (userId) => {
  const sql = `DELETE FROM ${tableName} WHERE ${RefreshTokenModel.user_id} = ?`;

  const [result] = await db.query(sql, userId);

  return result;
};

exports.fetchRefreshTokenData = handleGetDataError(
  fetchRefreshTokenData,
  tableName
);

exports.createRefreshTokenData = handleCreateDataError(
  createRefreshTokenData,
  tableName
);

exports.deleteRefreshTokenData = handleDeleteDataError(
  deleteRefreshTokenData,
  tableName
);
