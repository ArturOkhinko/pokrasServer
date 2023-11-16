class vkError extends Error {
  status;
  errors;
  constructor(status, message, error = []) {
    super(message);
    this.status = status;
    this.errors = error;
  }

  static UnauthorizedError() {
    return new vkError(401, "Пользователь не авторизован");
  }
  static BedRequest(message, errors = []) {
    return new vkError(400, message, errors);
  }
}

module.exports = vkError;
