const mysql = require("mysql");
const dotenv = require("dotenv");

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
    const selectDescription = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(`SELECT * FROM ${tableName}`, (err, res) => {
          if (err) {
            return;
          }
          resolve(res);
        });
      });
    };
    return selectDescription();
  }
}
module.exports = new ClientController();
