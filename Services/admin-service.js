const { query } = require("express");
const tokenService = require("./token-service.js");
const mysql = require("mysql");
const { v4 } = require("uuid");
const ApiError = require("../Api-err/api-error.js");
class AdminService {
  constructor() {
    this.connect = mysql.createPool({
      connectionLimit: 50,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
  }
  async mainDescription(data) {
    const id = v4();
    this.connect.query(
      `INSERT description (id, header, description, img) VALUES("${id}", "${data.header}", "${data.description}", "${data.img}")`,
      (err, res) => {
        if (res) {
          console.log(res);
        }
      }
    );
    return {
      id,
      message: "изменения добавленны",
    };
  }

  async deleteMainDescription(id, accessToken) {
    this.connect.query(
      `
          DELETE FROM description WHERE id="${id}"
          `
    );
  }

  async descriptionPost(data) {
    const id = v4();
    this.connect.query(
      `
              INSERT postDescription (id, header, description, img) VALUE("${id}", "${data.header}", "${data.description}", "${data.img}")
          `
    );
    return {
      id,
      message: "Изменения сохранены успешно",
    };
  }

  async removeDescriptionPost(id) {
    const deleteDescriptionPost = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `DELETE FROM postDescription WHERE id="${id}"`,
          (err, res) => {
            if (err) {
              reject({ error: err });
              return;
            }
            resolve(res);
          }
        );
      });
    };
    try {
      deleteDescriptionPost();
    } catch (e) {
      throw ApiError.BedRequest("", [e]);
    }
    return;
  }
  async wheelInfo(id, initialPriceCount, price) {
    const updateInfoAboutWheel = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `UPDATE wheelInfo SET initialPriceCount="${initialPriceCount}", price="${price}" WHERE id="${id}"`,
          (err, res) => {
            if (err) {
              reject({ error: err });
            }
            if (res) {
              resolve({ response: res });
            }
          }
        );
      });
    };
    try {
      updateInfoAboutWheel();
      return {
        message: "Данные изменены",
      };
    } catch (e) {
      throw ApiError.BedRequest("", [e]);
    }
  }
  async getInfoAboutUser(refreshToken) {
    const userData = tokenService.validRefreshToken(refreshToken);
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    const selectTokens = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT id, accessToken FROM tokens WHERE refreshToken="${refreshToken}"`,
          (err, res) => {
            if (res && res[0]) {
              resolve(res[0]);
            }
            if (res && !res[0]) {
              resolve({ error: "Пользователя не существует" });
            }
          }
        );
      });
    };
    const searchUser = (id) => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT email FROM users WHERE id = "${id}"`,
          (err, res) => {
            if (res) {
              resolve(res[0]);
            }
          }
        );
      });
    };
    const token = await selectTokens();
    if (token.error) {
      throw ApiError.BedRequest(token.message);
    }
    const userEmail = await searchUser(token.id);
    return {
      accessToken: token.accessToken,
      user: {
        role: userData.role,
        email: userEmail.email,
      },
    };
  }
  async updateInfoTruckWheels(data) {
    const updateDataAboutTrukInfo = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `UPDATE truckInfo SET initialPriceCount="${data.initialPriceCount}", price="${data.price}" WHERE id="${data.id}"`,
          (err, res) => {
            if (err) {
              reject(err);
            }
            if (res) {
              resolve(res);
            }
          }
        );
      });
    };
    try {
      updateDataAboutTrukInfo();
      return {
        message: "Изменения сохранены успешно",
      };
    } catch (e) {
      throw ApiError.BedRequest("", [e]);
    }
  }
  async updateInfoSupports(data) {
    this.connect.query(
      `UPDATE supports SET defaultValue="${data.defaultValue}", price="${data.price}", text="${data.text}", name="${data.name}" WHERE id="${data.id}"`,
      (err, res) => {}
    );
    return {
      status: 200,
      message: "Изменения сохранены успешно",
    };
  }
  async updateInfoSandblast(data) {
    const id = v4();
    this.connect.query(
      `INSERT sandblast (id, name, price) VALUES("${id}","${data.name}", "${data.price}")`
    );
    return {
      id,
    };
  }
  async deleteInfoSandblast(id) {
    this.connect.query(`DELETE FROM sandblast WHERE id="${id}"`);
    return {
      message: "Изменения сохранены успешно",
    };
  }
  async addImgOnPowderPoint(data) {
    console.log(data);
    const id = v4();
    this.connect.query(
      `INSERT powderPoint(id, img) VALUES("${id}", "${data.linkToImg}")`
    );
    return {
      id,
    };
  }
  async removeImgOnPrintPowderPoint(id) {
    this.connect.query(
      `DELETE FROM powderPoint WHERE id="${id}"`,
      (err, res) => {
        if (err) {
          console.log(err);
        }
        if (res) {
          console.log(res);
        }
      }
    );
    return {
      message: "Изменения сохранены успешно",
    };
  }
}

module.exports = new AdminService();
