const ApiError = require("../Api-err/api-error");
const tokenService = require("../Services/token-service");

module.exports = function authMiddleware(req, res, next) {
  try {
    const authorisationHeader = req.headers.authorization;
    if (!authorisationHeader) {
      next(ApiError.UnauthorizedError());
    }
    const accessToken = authorisationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    if (userData.role !== "admin") {
      return next(ApiError.BedRequest("У вас нет таких прав"));
    }
    req.user = userData;
    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
};
