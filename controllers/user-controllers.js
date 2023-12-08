const ApiError = require("../Api-err/api-error.js");
const userService = require("../Services/user-service.js");
const dotenv = require("dotenv");

dotenv.config();
class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, code } = req.body;
      const userData = await userService.registration(email, password, code);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.json({
        user: {
          email,
          accessToken: userData.accessToken,
          role: userData.role,
        },
        message: `Письмо с ссылкой для подтверждения отправленно на почту ${email}`,
      });
    } catch (e) {
      next(e);
    }
  }
  async active(req, res, next) {
    try {
      const activationLink = req.params.link.slice(1);
      console.log(activationLink);
      userService.active(activationLink);
      res.redirect(process.env.URL_CLIENT);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      if (userData.status === 400) {
        return res.status(400).json({
          status: userData.status,
          message: userData?.message || "not message",
        });
      }
      res.json({ ...userData });
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const operationStatus = await userService.login(email, password);
      if (operationStatus.error) {
        throw ApiError.BedRequest(error);
      }

      res.cookie("refreshToken", operationStatus.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.json({
        role: operationStatus.role,
        accessToken: operationStatus.accessToken,
        email,
        status: 200,
        message: "Вы успешно вошли в аккаунт",
      });
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.logout(refreshToken);
      if (userData) {
        res.clearCookie("refreshToken");
        return res.json({
          status: 200,
          message: "Вы успешно вышли из аккаунта",
        });
      }
      return res.status(400).json({
        status: 400,
        message: "Необходимо войти в аккаунт чтобы из него выйти",
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
