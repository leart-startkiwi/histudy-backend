const db = require("../../config/db");

exports.fetchOneRecordData = async (tableName, key, connection = db) => {
  try {
    let fields = ["id"];
    let values = [key];
    let placeholders = ["?"];
    let sqlCondition = `WHERE ${fields} = ${placeholders}`;

    if (typeof key === "object") {
      fields = Object.keys(key);
      values = Object.values(key);
      sqlCondition = `WHERE ${fields
        .map((field) => `${field} = ?`)
        .join(" AND ")}`;
    }

    const [result] = await connection.query(
      `SELECT * FROM ${tableName} ${sqlCondition}`,
      [...values]
    );

    return result[0];
  } catch (error) {
    console.log(`ERROR FETCHING`, error);
    throw { message: "Something went wrong" };
  }
};

exports.updateData = async (tableName, id, body) => {
  try {
    const fields = Object.keys(body);
    const values = [...Object.values(body)];

    const [result] = await db.query(
      `UPDATE ${tableName} SET ${fields.map(
        (field) => `${field} = ?`
      )}, updated_at = ? WHERE id = ?`,
      [...values, new Date(), id]
    );

    const [data] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
      id,
    ]);

    return data[0];
  } catch (error) {
    console.log(`ERROR UPDATING ${tableName.toUpperCase()}`, error);

    throw error;
  }
};

exports.createData = async (tableName, body, connection = db) => {
  try {
    const fields = Object.keys(body);
    const values = Object.values(body);
    const placeholders = values.map((value) => "?");

    const [result] = await connection.query(
      `INSERT INTO ${tableName} (${fields}) VALUES (${placeholders})`,
      values
    );

    const [data] = await connection.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [result.insertId]
    );

    return data[0];
  } catch (error) {
    console.log(`ERROR CREATING ${tableName.toUpperCase()}`, error);
    throw error;
  }
};

exports.deleteData = async (tableName, key, connection = db) => {
  try {
    let fields = ["id"];
    let values = [key];
    let placeholders = ["?"];
    let sqlCondition = `WHERE ${fields} = ${placeholders}`;

    if (typeof key === "object") {
      fields = Object.keys(key);
      values = Object.values(key);
      sqlCondition = `WHERE ${fields
        .map((field) => `${field} = ?`)
        .join(" AND ")}`;
    }

    const sql = `DELETE FROM ${tableName} ${sqlCondition}`;

    const [result] = await connection.query(sql, [...values]);

    return result;
  } catch (error) {
    console.log(`ERROR DELETING`, error);
    throw { message: "Something went wrong" };
  }
};
