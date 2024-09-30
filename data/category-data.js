const db = require("../config/db");
const { dbStructure, categoriesTable } = require("../config/dbStructure");
const {
  handleGetDataError,
  handleDeleteDataError,
} = require("../services/errors");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === categoriesTable
);

const fetchCategoriesData = async () => {
  const sql = `SELECT ${defaultFields} FROM ${tableName}`;
  const [result] = await db.query(sql);

  return result;
};

const deleteCategoryData = async (categoryId) => {
  const sql = `DELETE FROM ${tableName} WHERE id = ?`;

  const [result] = await db.query(sql, [categoryId]);

  return result;
};

module.exports.fetchCategoriesData = handleGetDataError(
  fetchCategoriesData,
  tableName
);
module.exports.deleteCategoryData = handleDeleteDataError(
  deleteCategoryData,
  tableName
);
