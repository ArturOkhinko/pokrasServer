const dotenv = require("dotenv");
const vkAppService = require("../Services/vkApp-service");

dotenv.config();

class VkAppController {
  async authorisation(req, res, next) {
    try {
      const { email } = req.body;
      const discount = await vkAppService.authorisation(email);
      return res.json({ amountOfDiscount: discount.amountOfDiscount });
    } catch (e) {
      next(e);
    }
  }
  async registration(req, res, next) {
    try {
      const { amountOfDiscount, email } = req.body;
      await vkAppService.registration(amountOfDiscount, email);
      res.json({
        message: `Пользователь ${email} зарегестрирован, письмо отправленно`,
      });
    } catch (e) {
      next(e);
    }
  }
  async sendDiscountPromocode(req, res, next) {
    try {
      const { email } = req.body;
      console.log(email);
      const operationStatus = await vkAppService.sendDiscountPromocode(email);
      res.json({
        message: operationStatus.message,
      });
    } catch (e) {
      next(e);
    }
  }

  async incrementDiscount(req, res, next) {
    try {
      const { amountOfDiscount, email } = req.body;
      console.log(amountOfDiscount);
      const operationsInfo = await vkAppService.incrementDiscount(
        amountOfDiscount,
        email
      );
      res.json({
        message: operationsInfo.message,
      });
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
      res.json(infoFromDatabase);
    } catch (e) {
      next(e);
    }
  }
  async getUserWidthDiscount(req, res, next) {
    try {
      const { promocode } = req.body;
      console.log(promocode);
      const infoFromDatabase = await vkAppService.getUserWidthDiscount(
        promocode
      );
      res.json(infoFromDatabase);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new VkAppController();
