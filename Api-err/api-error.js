class ApiError extends Error {
  status;
  errors;
  constructor(status, message, error = []) {
    super(message);
    this.status = status;
    this.errors = error;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }
  static BedRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}

module.exports = ApiError;
