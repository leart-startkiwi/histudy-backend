const db = require("../config/db");
const {
  coursesTable,
  dbStructure,
  categoriesTable,
  reviewsTable,
  coursesAssignedTable,
  courseContentsTable,
  usersTable,
} = require("../config/dbStructure");
const {
  convertToJson,
  joinTables,
  convertQueryCondition,
  noAmbigiousFields,
} = require("../helpers/utils");
const CategoryModel = require("../models/CategoryModel");
const CourseContentsModel = require("../models/CourseContentsModel");
const CourseModel = require("../models/CourseModel");
const CoursesAssignedModel = require("../models/CoursesAssignedModel");
const ReviewModel = require("../models/ReviewModel");
const UserModel = require("../models/UserModel");
const {
  handleGetDataError,
  handleCreateDataError,
} = require("../services/errors");
const { updateData } = require("./baseQueries/baseQueries");

const { tableName, defaultFields } = dbStructure.find(
  (structure) => structure.tableName === coursesTable
);

const { tableName: categoryTable, defaultFields: categoryFields } =
  dbStructure.find((structure) => structure.tableName === categoriesTable);

const { tableName: reviewTable, defaultFields: reviewFields } =
  dbStructure.find((structure) => structure.tableName === reviewsTable);

const nonAmbigiousFields = defaultFields.map(
  (field) => `${tableName}.${field}`
);

const fetchCoursesData = async (queryObj) => {
  const queryValues = [];
  const filters = [];
  let sort = `reviews_count DESC`;

  filters.push(`${CourseModel.published} = 1`);

  if (queryObj[CourseModel.name]) {
    filters.push(`${CourseModel.name} LIKE ?`);
    queryValues.push(`%${queryObj[CourseModel.name]}%`);
  }

  if (queryObj[CourseModel.categoryId]) {
    filters.push(`${CourseModel.categoryId} = ?`);
    queryValues.push(`${queryObj[CourseModel.categoryId]}`);
  }

  if (queryObj[CourseModel.price]) {
    const priceField = CourseModel.price;
    const priceValue = queryObj[CourseModel.price];
    if (priceValue.toLowerCase() === "free") {
      filters.push(`(${priceField} = 0 OR ${priceField} IS NULL) `);
    } else {
      filters.push(`${priceField} > 0`);
    }
  }

  if (queryObj.level) {
    filters.push(`${CourseModel.skillLevel} = ?`);
    queryValues.push(`${queryObj.level}`);
  }

  if (queryObj[CourseModel.language]) {
    filters.push(`${CourseModel.language} = ?`);
    queryValues.push(`${queryObj[CourseModel.language]}`);
  }

  if (queryObj.sort) {
    if (queryObj.sort === "reviews_count") {
      sort = sort;
    }

    if (queryObj.sort === "newest") {
      sort = `created_at DESC`;
    }

    if (queryObj.sort === "highest_rated") {
      sort = `avg_rating DESC`;
    }
  }

  if (queryObj.popular) {
    sort = `students_count DESC`;
  }

  if (queryObj.courseIds) {
    filters.push(`${tableName}.id IN (?)`);
    queryValues.push(queryObj.courseIds);
  }

  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(tableName, CourseModel.user_id, usersTable);

  const assignedCoursesJoin = joinTables(
    tableName,
    CourseModel.id,
    coursesAssignedTable,
    CoursesAssignedModel.course_id,
    "LEFT"
  );
  const studentsCount = `(SELECT COUNT(${coursesAssignedTable}.${CoursesAssignedModel.user_id}) FROM ${coursesAssignedTable} WHERE ${coursesAssignedTable}.course_id = ${tableName}.id) AS students_count`;

  const courseContentsJoin = joinTables(
    tableName,
    CourseModel.id,
    courseContentsTable,
    CourseContentsModel.course_id,
    "LEFT"
  );
  const contentsCount = `(SELECT COUNT(${courseContentsTable}.id) FROM ${courseContentsTable} WHERE ${courseContentsTable}.course_id = ${tableName}.id) AS content_count`;
  const courseDuration = `(SELECT SUM(${courseContentsTable}.duration) FROM ${courseContentsTable} WHERE ${courseContentsTable}.course_id = ${tableName}.id) AS duration`;

  const courseReviewsJoin = joinTables(
    tableName,
    CourseModel.id,
    reviewsTable,
    reviewsTable.course_id,
    "LEFT"
  );
  const reviewsCount = `(SELECT COUNT(${reviewsTable}.${ReviewModel.course_id}) FROM ${reviewsTable} WHERE ${reviewsTable}.course_id = ${tableName}.id) AS reviews_count`;
  const averageRating = `(SELECT AVG(${reviewsTable}.${ReviewModel.rating}) FROM ${reviewsTable} WHERE ${reviewsTable}.course_id = ${tableName}.id) AS avg_rating`;
  const totalResultsSql = `SELECT COUNT(*) as total FROM (SELECT ${noAmbigiousFields(
    tableName,
    defaultFields
  )} FROM ${tableName} ${userJoin} ${assignedCoursesJoin} ${courseContentsJoin} ${courseReviewsJoin} ${
    filters.length ? "WHERE " + filters.join(" AND ") : ""
  } GROUP BY ${noAmbigiousFields(tableName, defaultFields)}) as groupedResults`;
  const [totalResults] = await db.query(totalResultsSql, queryValues);

  const sql = `SELECT ${noAmbigiousFields(
    tableName,
    defaultFields
  )}, ${user_json_object}, ${studentsCount}, ${contentsCount}, ${reviewsCount}, ${averageRating}, ${courseDuration}, ${tableName}.created_at FROM ${tableName} ${userJoin} ${assignedCoursesJoin} ${courseContentsJoin} ${courseReviewsJoin} ${
    filters.length ? "WHERE " + filters.join(" AND ") : ""
  } GROUP BY ${noAmbigiousFields(tableName, defaultFields)} ORDER BY ${sort} ${
    queryObj.popular || queryObj.skip
      ? `LIMIT ${queryObj.popular ? "3" : `${queryObj.skip},6`}`
      : ""
  } `;

  const [result] = await db.query(sql, queryValues);

  return { courses: result, totalResults: totalResults?.at(0)?.total };
};

const fetchCourseData = async (courseId) => {
  const category_json_object = convertToJson(
    categoriesTable,
    categoryFields,
    "category"
  );

  const categoryJoin = joinTables(
    tableName,
    CourseModel.categoryId,
    categoryTable
  );

  const assignedCoursesJoin = joinTables(
    tableName,
    CourseModel.id,
    coursesAssignedTable,
    CoursesAssignedModel.course_id,
    "LEFT"
  );

  const courseContentsJoin = joinTables(
    tableName,
    CourseModel.id,
    courseContentsTable,
    CourseContentsModel.course_id,
    "LEFT"
  );

  const user_json_object = convertToJson(
    usersTable,
    [UserModel.id, UserModel.first_name, UserModel.last_name],
    "user"
  );
  const userJoin = joinTables(tableName, CourseModel.user_id, usersTable);

  const studentsCount = `(SELECT COUNT(DISTINCT ${coursesAssignedTable}.${CoursesAssignedModel.user_id}) FROM ${coursesAssignedTable} WHERE ${coursesAssignedTable}.course_id = ${tableName}.id) AS students_count`;
  const contentsCount = `(SELECT COUNT(DISTINCT ${courseContentsTable}.id) FROM ${courseContentsTable} WHERE ${courseContentsTable}.course_id = ${tableName}.id) AS content_count`;
  const courseDuration = `(SELECT SUM(${courseContentsTable}.duration) FROM ${courseContentsTable} WHERE ${courseContentsTable}.course_id = ${tableName}.id) AS duration`;

  const courseReviewsJoin = joinTables(
    tableName,
    CourseModel.id,
    reviewsTable,
    reviewsTable.course_id,
    "LEFT"
  );
  const reviewsCount = `(SELECT COUNT(${reviewsTable}.${ReviewModel.course_id}) FROM ${reviewsTable} WHERE ${reviewsTable}.course_id = ${tableName}.id) AS reviews_count`;
  const averageRating = `(SELECT AVG(${reviewsTable}.${ReviewModel.rating}) FROM ${reviewsTable} WHERE ${reviewsTable}.course_id = ${tableName}.id) AS avg_rating`;

  const sql = `SELECT ${nonAmbigiousFields}, ${category_json_object}, ${studentsCount},${contentsCount}, ${courseDuration}, ${user_json_object}, ${reviewsCount}, ${averageRating} FROM ${tableName} ${userJoin} ${categoryJoin} ${assignedCoursesJoin} ${courseContentsJoin} ${courseReviewsJoin} WHERE ${tableName}.id = ?;
`;

  const [result] = await db.query(sql, courseId);

  return result[0];
};

const fetchInstructorCoursesData = async (instructorId) => {
  const sql = `SELECT ${defaultFields} FROM ${tableName} WHERE ${CourseModel.user_id} = ? ORDER BY created_at DESC`;

  const [result] = await db.query(sql, instructorId);

  return result;
};

const fetchPopularCoursesData = async () => {
  const sql = `SELECT ${nonAmbigiousFields}, JSON_OBJECT('id', ${categoryTable}.id, 'name', ${categoryTable}.${CategoryModel.name}) AS category FROM ${tableName} INNER JOIN ${categoryTable} ON ${tableName}.${CourseModel.categoryId} = ${categoryTable}.id `;

  const [result] = await db.query(sql);

  return result;
};

exports.updateCourseData = async (courseId, body) => {
  return await updateData(tableName, courseId, body);
};

const createCourseData = async (body) => {
  const fields = Object.keys(body);
  const values = Object.values(body);
  const placeholders = values.map((value) => "?");

  const sql = `INSERT INTO ${tableName} (${fields}) VALUES (${placeholders})`;

  const [result] = await db.query(sql, values);

  const [data] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
    result.insertId,
  ]);

  return data[0];
};

module.exports.fetchCoursesData = handleGetDataError(
  fetchCoursesData,
  tableName
);

module.exports.fetchInstructorCoursesData = handleGetDataError(
  fetchInstructorCoursesData,
  tableName
);

module.exports.fetchCourseData = handleGetDataError(fetchCourseData, tableName);

module.exports.fetchPopularCoursesData = handleGetDataError(
  fetchPopularCoursesData,
  tableName
);

module.exports.createCourseData = handleCreateDataError(
  createCourseData,
  tableName
);
