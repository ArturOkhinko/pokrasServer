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
          resolve({ status: 400, error: err });
        }
        if (res) {
          resolve({ status: 200, res });
        }
      });
    });
    const status = await statusAboutOperation;

    if (status.status === 400) {
      throw ApiError.BedRequest("ошибка запроса к базе данных", status.error);
    }
    return { res: status.res };
  }
}
module.exports = new ClientController();
