const mysql = require("mysql");
const dotenv = require("dotenv");
const { v4 } = require("uuid");
const { response } = require("express");
const vkError = require("../Api-err/vk-error");
dotenv.config();

class VkAppService {
  constructor() {
    this.connect = mysql.createPool({
      connectionLimit: 50,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE_VK,
    });
  }
  async getInfoAboutUser(email) {
    return new Promise((resolve, reject) => {
      this.connect.query(
        `SELECT firstName, lastName, email FROM vk_users WHERE firstName = "${firstName}" AND lastName = "${lastName}" AND email = "${email}"`,
        (err, res) => {
          if (res[0]) {
            resolve({
              firstName: res.firstName,
              lsatName: res.lastName,
              email: res.email,
            });
            return;
          }
          resolve({ error: " " });
        }
      );
    });
  }
  async writeDownInfoAboutNewUser(firstName, lastName, email) {
    const id = v4();
    return new Promise((resolve, reject) => {
      this.connect.query(
        `SELECT * FROM vk_users WHERE email = "${email}"`,
        (err, res) => {
          if (res[0]) {
            resolve({ err: `пользователь ${email} уже существует` });
            return;
          }
          this.connect.query(
            `INSERT INTO vk_users (id, firstName, lastName, email) VALUES("${id}", "${firstName}", "${lastName}", "${email}")`
          );
          resolve(null);
        }
      );
    });
  }

  async getInfoFromDatabase(nameTable) {
    return new Promise((resolve, reject) => {
      this.connect.query(`SELECT * FROM ${nameTable}`, (err, res) => {
        if (err) {
          resolve({ status: 400, message: err.message });
        }
        if (res) {
          console.log(res);
          resolve({ status: 200, res });
        }
      });
    });
  }
}

module.exports = new VkAppService();
