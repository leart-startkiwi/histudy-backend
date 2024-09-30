const express = require("express");
const {
  handlePostRequest,
  handleDeleteRequest,
  handleGetOneRequest,
  handleGetRequest,
} = require("../services/baseController");
const {
  login,
  refreshToken,
  signin,
  logout,
  getRefreshToken,
  getUsersFullNames,
} = require("../services/user-services");
const { authenticateToken } = require("../middleware/jwt");
const router = express.Router();

router.post("/token", async (req, res) => {
  await handlePostRequest(
    () => refreshToken(req.body, res),
    "Failed to get refresh token",
    req,
    res
  );
});

router.get("/token/:userId", async (req, res) => {
  await handleGetOneRequest(
    () => getRefreshToken(req.params.userId),
    "Failed to fetch refresh token",
    res
  );
});

router.post("/login", async (req, res) => {
  await handlePostRequest(
    () => login(req.body, res),
    "Failed to login",
    req,
    res
  );
});

router.post("/signin", async (req, res) => {
  await handlePostRequest(() => signin(req.body), "Failed to signin", req, res);
});

router.post("/logout", async (req, res) => {
  await handleDeleteRequest(() => logout(req.body), "Failed to logout", res);
});

module.exports = router;
