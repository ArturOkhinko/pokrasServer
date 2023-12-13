const ApiError = require("../Api-err/api-error");
const adminService = require("../Services/admin-service");

class AdminController {
  async mainDescription(req, res, next) {
    try {
      const { data } = req.body;
      const status = await adminService.mainDescription(data);
      res.json({ ...status });
    } catch (e) {
      next(e);
    }
  }
  async deleteMainDescription(req, res, next) {
    try {
      const { id } = req.body;
      await adminService.deleteMainDescription(id);
      res.json({ message: "Удаленно" });
    } catch (e) {
      next(e);
    }
  }
  async descriptionPost(req, res, next) {
    try {
      const { data } = req.body;
      if (!data) {
        throw ApiError.BedRequest("Поля не заполнены");
      }
      const responce = await adminService.descriptionPost(data);
      res.json(responce);
    } catch (e) {
      next(e);
    }
  }
  async removeDescriptionPost(req, res, next) {
    try {
      const { id } = req.body;
      await adminService.removeDescriptionPost(id);
      return res.json({ id });
    } catch (e) {
      next(e);
    }
  }
  async wheelInfo(req, res, next) {
    try {
      const { data } = req.body;
      const info = await adminService.wheelInfo(
        data.id,
        data.initialPriceCount,
        data.price
      );
      res.json(info);
    } catch (e) {
      next(e);
    }
  }
  async getInfoAboutUser(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await adminService.getInfoAboutUser(refreshToken);
      return res.json({
        ...userData,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateInfoTruckWheel(req, res, next) {
    try {
      const { data } = req.body;
      const operationInfo = await adminService.updateInfoTruckWheels(data);
      res.json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async updateInfoSupports(req, res, next) {
    try {
      const { data } = req.body;
      const operationInfo = await adminService.updateInfoSupports(data);
      return res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async updateInfoSandblast(req, res, next) {
    try {
      const { data } = req.body;
      const operationInfo = await adminService.updateInfoSandblast(data);
      return res.json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async deleteInfoSandblast(req, res, next) {
    try {
      const { id } = req.body;
      const operationInfo = await adminService.deleteInfoSandblast(id);
      return res.json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async addImgOnPrintPowderPoint(req, res, next) {
    try {
      const { data } = req.body;
      const operationInfo = await adminService.addImgOnPowderPoint(data);
      return res.json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async removeImgOnPrintPowderPoint(req, res, next) {
    try {
      const { id } = req.body;
      const operationInfo = await adminService.removeImgOnPrintPowderPoint(id);
      return res.json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
