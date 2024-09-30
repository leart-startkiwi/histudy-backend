exports.handlePostPutErrors = (error, errorMessage, res) => {
  switch (error.errno) {
    case 3819:
      return res.status(400).json({
        status: "error",
        message: `A value was not expected. Please check constraints`,
      });

    case 1364:
      return res.status(400).json({
        status: "error",
        message: `${
          error.sqlMessage.match(/'([^']+)'/)[1]
        } is required. Please provide a value for this field.`,
      });

    case 1054:
      return res.status(400).json({
        status: "error",
        message: `${
          error.sqlMessage.match(/'([^']+)'/)[1]
        } is not a valid field name`,
      });

    case 1062:
      return res.status(409).json({
        status: "error",
        message: `${
          error.sqlMessage.match(/'([^']+)'/)[1]
        } already exists. Please use another value!`,
      });

    case 1452:
      const regex = /FOREIGN KEY \(`([^`]+)`\)/;
      const match = error.sqlMessage.match(regex);

      return res.status(409).json({
        status: "error",
        message:
          match && match[1]
            ? `This ${match[1]} does not exist!`
            : "Foreign key constraint fails.",
      });

    default:
      return res.status(500).json({
        status: "fail",
        message: errorMessage,
      });
  }
};

exports.handleGetDataError = (fn, tableName) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error fetching ${tableName.toUpperCase()}`, error);
      throw { message: "Something went wrong" };
    }
  };
};

exports.handleCreateDataError = (fn, tableName) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error creating ${tableName.toUpperCase()}`, error);
      throw error;
    }
  };
};

exports.handleDeleteDataError = (fn, tableName) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error deleting ${tableName.toUpperCase()}`, error);
      throw { message: "Something went wrong" };
    }
  };
};
