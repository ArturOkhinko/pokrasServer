const mysql = require("mysql");
const dotenv = require("dotenv");
const { v4 } = require("uuid");
const ApiError = require("../Api-err/api-error");
const mailService = require("./mail-service");
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

  async authorisation(email) {
    const getInfoAboutUser = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT email, discount FROM vk_users WHERE email = "${email}"`,
          (err, res) => {
            if (res[0]) {
              resolve({ discount: res[0].discount });
            }
            reject({ message: "Пользователя не существует" });
          }
        );
      });
    };

    try {
      const discount = await getInfoAboutUser();
      return { amountOfDiscount: discount };
    } catch (error) {
      throw ApiError.BedRequest(error.message);
    }
  }

  async registration(amountOfDiscount, email) {
    const id = v4();
    const writeUser = async () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT * FROM vk_users WHERE email = "${email}"`,
          (err, res) => {
            if (res[0]) {
              resolve({ error: `Пользователь ${email} уже существует` });
            }
            if (!res[0]) {
              resolve();
            }
          }
        );
      });
    };
    const statusOperation = await writeUser();
    if (statusOperation?.error) {
      throw ApiError.BedRequest(statusOperation.error);
    }
    this.connect.query(
      `INSERT INTO vk_users (id, email, discount) VALUES("${id}", "${email}", "${amountOfDiscount}")`
    );

    try {
      await mailService.sendDiscountPromocode(email, id);
      console.log(id);
    } catch (e) {
      throw ApiError.EmailError();
    }
  }
  async sendDiscountPromocode(email) {
    const writeUser = async () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT id FROM vk_users WHERE email = "${email}"`,
          (err, res) => {
            if (!res[0]) {
              resolve({ error: `Пользователь ${email} не существует` });
            }
            if (res) {
              resolve({ id: res[0].id });
            }
          }
        );
      });
    };
    const statusOperation = await writeUser();
    if (statusOperation?.error) {
      throw ApiError.BedRequest(statusOperation.error);
    }
    try {
      await mailService.sendDiscountPromocode(email, statusOperation.id);
    } catch (e) {
      throw ApiError.EmailError();
    }
    return { message: "письмо отправленно" };
  }

  async incrementDiscount(amountOfDiscount, email) {
    if (amountOfDiscount > process.env.MAX_DISCOUNT_FROM_VK) {
      throw ApiError.BedRequest("у пользователя максмальная скидка", []);
    }
    const increment = async () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `UPDATE vk_users SET discount="${amountOfDiscount}" WHERE email="${email}"`,
          (err, res) => {
            if (err) {
              resolve({ error: err });
            }
            if (res) {
              resolve();
            }
          }
        );
      });
    };
    const statusOperation = await increment();
    if (statusOperation?.error) {
      throw ApiError.BedRequest(
        "Ошибка при обнавлении информации",
        statusOperation.error
      );
    }
    return { message: "Данные измененны" };
  }

  async getInfoFromDatabase(nameTable) {
    const getData = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(`SELECT * FROM ${nameTable}`, (err, res) => {
          if (err) {
            resolve({ error: err });
          }
          if (res) {
            resolve(res);
          }
        });
      });
    };
    const data = getData();
    if (data.error) {
      throw ApiError.BedRequest(data.error.message, [data.error]);
    }
    return data;
  }
  async getUserWidthDiscount(promocode) {
    const getData = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT email, discount FROM vk_users WHERE id = "${promocode}"`,
          (err, res) => {
            if (err) {
              resolve({ error: err });
            }
            if (res) {
              resolve(res[0]);
            }
          }
        );
      });
    };
    const data = getData();
    if (data.error) {
      throw ApiError.BedRequest(data.error.message, [data.error]);
    }
    return data;
  }
}

module.exports = new VkAppService();
