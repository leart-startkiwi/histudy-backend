const CategoryModel = require("../models/CategoryModel");
const CourseModel = require("../models/CourseModel");
const UserModel = require("../models/UserModel");
const RefreshTokenModel = require("../models/RefreshTokenModel");
const LikeModel = require("../models/LikeModel");
const CartModel = require("../models/CartModel");
const CoursesAssignedModel = require("../models/CoursesAssignedModel");
const ReviewModel = require("../models/ReviewModel");
const CourseContentModel = require("../models/CourseContentModel");
const CourseSectionModel = require("../models/CourseSectionModel");
const UserProgressModel = require("../models/UserProgressModel");
const LastProgressModel = require("../models/LastProgressModel");
const QuestionModel = require("../models/QuestionModel");
const QuestionUpvoteModel = require("../models/QuestionUpvoteModel");
const QuestionReplyModel = require("../models/QuestionReplyModel");
const ReplyUpvoteModel = require("../models/ReplyUpvoteModel");

const categoriesTable = "categories";
exports.categoriesTable = categoriesTable;

const coursesTable = "courses";
exports.coursesTable = coursesTable;

const usersTable = "users";
exports.usersTable = usersTable;

const refreshTokensTable = "refresh_tokens";
exports.refreshTokensTable = refreshTokensTable;

const likesTable = "likes";
exports.likesTable = likesTable;

const cartsTable = "carts";
exports.cartsTable = cartsTable;

const coursesAssignedTable = "courses_assigned";
exports.coursesAssignedTable = coursesAssignedTable;

const reviewsTable = "reviews";
exports.reviewsTable = reviewsTable;

const courseContentsTable = "course_contents";
exports.courseContentsTable = courseContentsTable;

const courseSectionsTable = "course_sections";
exports.courseSectionsTable = courseSectionsTable;

const usersProgressTable = "user_progress";
exports.usersProgressTable = usersProgressTable;

const lastProgressTable = "last_progress";
exports.lastProgressTable = lastProgressTable;

const questionsTable = "questions";
exports.questionsTable = questionsTable;

const upvotesTable = "upvotes";
exports.upvotesTable = upvotesTable;

const questionRepliesTable = "question_replies";
exports.questionRepliesTable = questionRepliesTable;

const replyUpvotesTable = "replies_upvotes";
exports.replyUpvotesTable = replyUpvotesTable;

exports.dbStructure = [
  {
    tableName: categoriesTable,
    defaultFields: Object.keys(CategoryModel),
  },
  {
    tableName: coursesTable,
    defaultFields: Object.keys(CourseModel),
  },
  { tableName: usersTable, defaultFields: Object.keys(UserModel) },
  {
    tableName: refreshTokensTable,
    defaultFields: Object.keys(RefreshTokenModel),
  },
  { tableName: likesTable, defaultFields: Object.keys(LikeModel) },
  { tableName: cartsTable, defaultFields: Object.keys(CartModel) },
  {
    tableName: coursesAssignedTable,
    defaultFields: Object.keys(CoursesAssignedModel),
  },
  { tableName: reviewsTable, defaultFields: Object.keys(ReviewModel) },
  {
    tableName: courseSectionsTable,
    defaultFields: Object.keys(CourseSectionModel),
  },
  {
    tableName: courseContentsTable,
    defaultFields: Object.keys(CourseContentModel),
  },
  {
    tableName: usersProgressTable,
    defaultFields: Object.keys(UserProgressModel),
  },
  {
    tableName: lastProgressTable,
    defaultFields: Object.keys(LastProgressModel),
  },
  {
    tableName: questionsTable,
    defaultFields: Object.keys(QuestionModel),
  },
  { tableName: upvotesTable, defaultFields: Object.keys(QuestionUpvoteModel) },
  {
    tableName: questionRepliesTable,
    defaultFields: Object.keys(QuestionReplyModel),
  },
  {
    tableName: replyUpvotesTable,
    defaultFields: Object.keys(ReplyUpvoteModel),
  },
];
