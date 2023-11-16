const dotenv = require("dotenv");
const vkAppService = require("../Services/vkApp-service");

dotenv.config();

class VkAppController {
  async getInfoAboutUser(req, res, next) {
    try {
      const { firstName, lastName, email } = req.body;
      const operationStatus = await vkAppService.getInfoAboutUser(
        firstName,
        lastName,
        email
      );
      if (operationStatus.error) {
        return res.status(400).json({ error: operationStatus.error });
      }
      return res.status(200).json({ message: "пользователь авторизован" });
    } catch (e) {
      next(e);
    }
  }
  async writeDownInfoAboutNewUser(req, res, next) {
    try {
      const { firstName, lastName, email } = req.body;
      const operationStatus = await vkAppService.writeDownInfoAboutNewUser(
        firstName,
        lastName,
        email
      );
      if (operationStatus) {
        return res.status(401).json({ error: operationStatus.err });
      }
      return res.status(200).json({ message: "пользователь зарегестрирован" });
    } catch (e) {
      next(e);
    }
  }
  async getInfoFromDatabase(req, res, next) {
    try {
      const { tableName } = req.query;
      const infoFromDatabase = await vkAppService.getInfoFromDatabase(
        tableName
      );
      res.status(infoFromDatabase.status).json(infoFromDatabase);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new VkAppController();
