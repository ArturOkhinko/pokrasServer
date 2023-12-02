const clientService = require("../Services/client-service");

class ClientController {
  async getInfo(req, res, next) {
    try {
      const { tableName } = req.query;
      console.log(tableName);
      const responce = await clientService.getInfo(tableName);
      res.json({ responce });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ClientController();
