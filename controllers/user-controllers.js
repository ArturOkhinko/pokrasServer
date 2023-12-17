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
      });

      return res.json({
        user: {
          accessToken: userData.accessToken,
          user: {
            email,
            role: userData.role,
          },
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
      console.log("refresh");
      const operationInfo = await userService.refresh(refreshToken);
      if (operationInfo.error) {
        throw ApiError.UnauthorizedError();
      }
      res.json({ accessToken: operationInfo.accessToken });
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const operationStatus = await userService.login(email, password);

      res.cookie("refreshToken", operationStatus.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json({
        accessToken: operationStatus.accessToken,
        user: {
          role: operationStatus.role,
          email,
        },
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
          message: "Вы успешно вышли из аккаунта",
        });
      }
      throw ApiError.BedRequest(
        "Необходимо войти в аккаунт чтобы из него выйти",
        []
      );
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
