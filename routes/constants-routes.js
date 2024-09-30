const express = require("express");
const { languages, statuses, prices } = require("../helpers/utils");

const router = express.Router();

router.get("/languages", (req, res) => {
  return res.status(200).json({ status: "success", data: languages });
});

router.get("/statuses", (req, res) => {
  return res.status(200).json({ status: "success", data: statuses });
});

router.get("/prices", (req, res) => {
  return res.status(200).json({ status: "success", data: prices });
});

module.exports = router;
