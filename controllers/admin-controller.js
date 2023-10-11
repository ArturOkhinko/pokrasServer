const adminService = require("../Services/admin-service");

class AdminController {
  async mainDescription(req, res, next) {
    try {
      const data = req.body;
      if (!data.accessToken) {
        res.json({ status: 400, message: "пользователь не авторизован" });
        return;
      }
      const status = await adminService.mainDescription(data);
      res.json({ ...status });
    } catch (e) {
      next(e);
    }
  }
  async deleteMainDescription(req, res, next) {
    try {
      const { id, accessToken } = req.body;
      const responce = adminService.deleteMainDescription(id, accessToken);
      if (responce.status) {
        res.json({ status: responce.status, message: responce.message });
        return;
      }
      responce.then((status) =>
        res.json({ status: status.status, message: status.message })
      );
    } catch (e) {
      next(e);
    }
  }
  async descriptionPost(req, res, next) {
    try {
      const data = req.body;
      if (!data) {
        res.status(400).json({ status: 400, message: "Поля не заполнены" });
        return;
      }
      const responce = await adminService.descriptionPost(data);
      res.json(responce);
    } catch (e) {
      next(e);
    }
  }
  async removeDescriptionPost(req, res, next) {
    try {
      const { accessToken, id } = req.body;
      const userData = await adminService.removeDescriptionPost(
        accessToken,
        id
      );
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async wheelInfo(req, res, next) {
    try {
      const { defaultValue, price, accessToken, radius, text, wheelName } =
        req.body;
      const info = await adminService.wheelInfo(
        defaultValue,
        price,
        accessToken,
        radius,
        text,
        wheelName
      );
      res.status(info.status).json(info);
    } catch (e) {
      next(e);
    }
  }
  async getInfoAboutUser(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await adminService.getInfoAboutUser(refreshToken)();
      if (userData.status === 400) {
        return res.status(userData.status).json(userData);
      }
      return res.json({
        email: userData.email,
        role: userData.role,
        accessToken: await userData.accessToken,
        status: 200,
        message: userData.message,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateInfoTruckWheel(req, res, next) {
    try {
      const { data, accessToken } = req.body;
      const operationInfo = await adminService.updateInfoTruckWheels(
        data,
        accessToken
      );
      console.log(operationInfo);
      res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async updateInfoSupports(req, res, next) {
    try {
      const { data, accessToken } = req.body;
      const operationInfo = await adminService.updateInfoSupports(
        data,
        accessToken
      );
      return res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async updateInfoSandblast(req, res, next) {
    try {
      const { data, accessToken } = req.body;
      const operationInfo = await adminService.updateInfoSandblast(
        data,
        accessToken
      );
      return res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async deleteInfoSandblast(req, res, next) {
    try {
      const { data, accessToken } = req.body;
      const operationInfo = await adminService.deleteInfoSandblast(
        data,
        accessToken
      );
      return res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async insertPowderPoint(req, res, next) {
    try {
      const { data, accessToken } = req.body;
      const operationInfo = await adminService.insertPowderPoint(
        data,
        accessToken
      );
      return res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
  async deletePowderPoint(req, res, next) {
    try {
      const { data, accessToken } = req.body;
      const operationInfo = await adminService.deletePowderPoint(
        data,
        accessToken
      );
      return res.status(operationInfo.status).json(operationInfo);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
