const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");

const categoryRouter = require("./routes/category-routes");
const courseRouter = require("./routes/course-routes");
const userRouter = require("./routes/user-routes");
const likeRouter = require("./routes/like-routes");
const cartRouter = require("./routes/cart-routes");
const assignedCoursesRouter = require("./routes/assigned-courses-routes");
const reviewRouter = require("./routes/review-routes");
const constantsRouter = require("./routes/constants-routes");
const courseSectionsRouter = require("./routes/course-section-routes");
const courseContentsRouter = require("./routes/course-content-routes");
const userProgressRouter = require("./routes/user-progress-routes");
const lastUserProgressRouter = require("./routes/last-progress-routes");
const announcementRouter = require("./routes/announcement-routes");
const announcementCommentRouter = require("./routes/announcement-comment-routes");
const questionsRouter = require("./routes/question-routes");
const upvotesRouter = require("./routes/upvote-routes");
const questionRepliesRouter = require("./routes/question-replies-routes");
const replyUpvoteRouter = require("./routes/reply-upvotes-routes");
const webhookRouter = require("./routes/webhook-router");
const chatRouter = require("./routes/chat-routes");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRouter
);
app.use(express.json());

app.use("/api/categories", categoryRouter);
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);
app.use("/api/likes", likeRouter);
app.use("/api/cart", cartRouter);
app.use("/api/assigned-courses", assignedCoursesRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/constants", constantsRouter);
app.use("/api/course-sections", courseSectionsRouter);
app.use("/api/course-contents", courseContentsRouter);
app.use("/api/user-progress", userProgressRouter);
app.use("/api/last-progress", lastUserProgressRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/announcement-comments", announcementCommentRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/upvotes", upvotesRouter);
app.use("/api/question-replies", questionRepliesRouter);
app.use("/api/reply-upvotes", replyUpvoteRouter);
app.use("/api/chat", chatRouter);

module.exports = app;
