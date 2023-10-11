const ApiError = require("../Api-err/api-error.js");

function errorMiddleware(err, req, res, next) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, error: err.errors });
  }
  res.status(500).json({ message: "Неопределенная ошибка" });
}

module.exports = errorMiddleware;
