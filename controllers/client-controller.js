const clientService = require("../Services/client-service");

class ClientController {
  async getInfo(req, res, next) {
    try {
      const { tableName } = req.query;
      console.log(tableName);
      const response = await clientService.getInfo(tableName);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ClientController();
