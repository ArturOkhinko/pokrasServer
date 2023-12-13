const mysql = require("mysql");
const dotenv = require("dotenv");
const ApiError = require("../Api-err/api-error");

dotenv.config();
class ClientController {
  constructor() {
    this.connect = mysql.createPool({
      connectionLimit: 50,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
  }
  async getInfo(tableName) {
    const statusAboutOperation = new Promise((resolve, reject) => {
      this.connect.query(`SELECT * FROM ${tableName}`, (err, res) => {
        if (err) {
          reject({ error: err });
        }
        if (res) {
          resolve(res);
        }
      });
    });
    try {
      const info = await statusAboutOperation;
      return info;
    } catch (e) {
      throw ApiError.BedRequest("ошибка запроса к базе данных", [e]);
    }
  }
}
module.exports = new ClientController();
