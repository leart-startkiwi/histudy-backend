const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const fs = require("fs");
const path = require("path");
const { handlePostPutErrors } = require("./errors");

exports.handleGetRequest = async (getDataFunc, errorMessage, res) => {
  try {
    const data = await getDataFunc();
    res.status(200).json({
      status: "success",
      results: data?.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: errorMessage,
    });
  }
};

exports.handleGetOneRequest = async (getOneRecordFunc, errorMessage, res) => {
  try {
    const data = await getOneRecordFunc();

    if (!data) {
      res.status(404).json({
        status: "error",
        message: "No record found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "No record found",
    });
  }
};

exports.handlePostRequest = async (
  createFunc,
  errorMessage,
  req,
  res,
  imageObj = null
) => {
  try {
    if (req.files && imageObj) {
      req.body[imageObj.field] = req.files
        .map(
          (file) =>
            `${process.env.BASE_URL}${process.env.PORT}${imageObj.path}${file.filename}`
        )
        .join(",");
    }

    let data = await createFunc();

    if (data.statusCode) return;

    if (typeof req.body === "object" && req.body !== null && "id" in req.body) {
      return res.status(400).json({
        status: "error",
        message: "IDs should be automatically generated.",
      });
    }

    if (
      typeof req.body === "object" &&
      req.body !== null &&
      ("created_at" in req.body || "updated_at" in req.body)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Dates are automatically generated",
      });
    }

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (error) {
    if (req.files && imageObj) {
      req.files.forEach((file) => {
        fs.unlink(path.join(__dirname, "..", file.path), (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    }

    handlePostPutErrors(error, errorMessage, res);
  }
};

exports.handleUpdateRequest = async (
  updateDataFunc,
  errorMessage,
  req,
  res,
  imageObj = null,
  contentObj = null
) => {
  try {
    if (req.files?.length && imageObj) {
      req.body[imageObj.field] = req.files
        .map(
          (file) =>
            `${process.env.BASE_URL}${process.env.PORT}${imageObj.path}${file.filename}`
        )
        .join(",");
    }

    if (req.file && contentObj) {
      req.body[
        contentObj.field
      ] = `${process.env.BASE_URL}${process.env.PORT}${contentObj.path}${req.file.filename}`;
      req.body.file_name = req.file.originalname;
    }

    const data = await updateDataFunc();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    if (req.files && imageObj) {
      req.files.forEach((file) => {
        fs.unlink(path.join(__dirname, "..", file.path), (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    }

    // if (req.file && contentObj) {
    //   fs.unlink(path.join(__dirname, "..", file.path), (err) => {
    //     if (err) console.error("Failed to delete file...", err);
    //   });
    // }

    handlePostPutErrors(error, errorMessage, res);
  }
};

exports.handleDeleteRequest = async (deleteDataFunc, errorMessage, res) => {
  try {
    const result = await deleteDataFunc();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "No record found",
      });
    }

    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: errorMessage,
    });
  }
};
