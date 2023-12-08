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
    this.isActivated = async (email) => {
      const isActivatedPromise = () => {
        return new Promise((resolve, reject) => {
          this.connect.query(
            `SELECT isActivated FROM users WHERE email="${email}"`,
            (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
              resolve(res);
            }
          );
        });
      };
      const isActivated = await isActivatedPromise();
      return isActivated;
    };
  }
  async mainDescription(data) {
    const userData = tokenService.validAccessToken(data.accessToken);
    console.log(userData);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);

    if (userData.role === "admin" && isActivated[0]?.isActivated === 1) {
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
        status: 200,
        message: "изменения добавленны",
      };
    }
    return {
      status: 400,
      message: "у вас нет таких прав",
    };
  }
  async deleteMainDescription(id, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role === "admin" && isActivated[0]?.isActivated === 1) {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `
          DELETE FROM description WHERE id="${id}"
          `,
          (err, res) => {
            resolve({
              id,
              status: 200,
              message: "Данные успешно удаленны",
            });
          }
        );
      });
    }
    return {
      status: 400,
      message: "у вас нет права удаления постов",
    };
  }

  async descriptionPost(data) {
    const userData = tokenService.validAccessToken(data.accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" && isActivated[0]?.isActivated === 1) {
      return {
        status: 400,
        message: "У вас нет таких прав",
      };
    }
    const id = v4();
    const insertPost = () => {
      this.connect.query(
        `
              INSERT postDescription (id, header, description, img) VALUE("${id}", "${data.header}", "${data.description}", "${data.img}")
          `
      );
    };

    insertPost();

    return {
      id,
      status: 200,
      message: "Изменения сохранены успешно",
    };
  }
  async removeDescriptionPost(accessToken, id) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "пользователь не авторизован",
      };
    }
    const role = userData.role;
    const isActivated = await this.isActivated(userData.email);
    if (role === "user" && isActivated[0]?.isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет таких прав",
      };
    }

    const deleteDescriptionPost = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `DELETE FROM postDescription WHERE id="${id}"`,
          (err, res) => {
            if (err) {
              resolve(err);
              return;
            }
            resolve(res);
          }
        );
      });
    };
    deleteDescriptionPost().then((res) => {
      if (res.message) {
        console.log(err);
      }
      console.log(res);
    });
    return {
      status: 200,
      message: "Данные успешно удаленны",
    };
  }
  async wheelInfo(defaultValue, price, accessToken, radius, text, wheelName) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь  не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role === "user" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет таких прав",
      };
    }

    const updateWheelInfo = () => {
      this.connect.query(
        `UPDATE wheelInfo SET defaultValue="${defaultValue}", price="${price}", text="${text}", name="${wheelName}" WHERE radius="${radius}"`
      );
    };
    updateWheelInfo();
    const selectWheelInfo = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT defaultValue, price, radius, text, name, id FROM wheelInfo`,
          (err, res) => {
            if (err) {
              console.log(err);
            }
            resolve(res);
          }
        );
      });
    };

    return {
      status: 200,
      message: "Данные изменены",
      wheelInfo: await selectWheelInfo(),
    };
  }
  getInfoAboutUser(refreshToken) {
    const userData = tokenService.validRefreshToken(refreshToken);
    console.log(refreshToken);
    if (!userData) {
      throw ApiError.BedRequest("Пользователь не авторизован");
    }
    const selectTokens = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT * FROM tokens WHERE refreshToken="${refreshToken}"`,
          (err, res) => {
            if (res && res[0]) {
              resolve(res[0].accessToken);
            }
            if (res && !res[0]) {
              resolve("");
            }
          }
        );
      });
    };

    return () => {
      const token = selectTokens();
      if (token.message) {
        return {
          message: token.message,
          ...userData,
        };
      }
      return {
        accessToken: token,
        ...userData,
      };
    };
  }
  async updateInfoTruckWheels(data, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет прав на изменение",
      };
    }
    this.connect.query(
      `UPDATE truckInfo SET defaultValue="${data.defaultValue}", price="${data.price}", text="${data.text}", name="${data.wheelName}" WHERE radius="${data.radius}"`
    );
    return {
      status: 200,
      message: "Изменения сохранены успешно",
    };
  }
  async updateInfoSupports(data, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }

    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет прав на изменение",
      };
    }
    this.connect.query(
      `UPDATE supports SET defaultValue="${data.defaultValue}", price="${data.price}", text="${data.text}", name="${data.name}" WHERE id="${data.id}"`,
      (err, res) => {}
    );
    return {
      status: 200,
      message: "Изменения сохранены успешно",
    };
  }
  async updateInfoSandblast(data, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет прав на изменение",
      };
    }
    const id = v4();
    this.connect.query(
      `INSERT sandblast (id, name, price) VALUES("${id}","${data.name}", "${data.price}")`
    );
    return {
      status: 200,
      message: "Изменения сохранены успешно",
      id,
    };
  }
  async deleteInfoSandblast(data, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет прав на изменение",
      };
    }
    this.connect.query(`DELETE FROM sandblast WHERE id="${data.id}"`);
    return {
      status: 200,
      message: "Изменения сохранены успешно",
    };
  }
  async insertPowderPoint(data, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет прав на изменение",
      };
    }
    const id = v4();
    this.connect.query(
      `INSERT powderPoint(id, img) VALUES("${id}", "${data.img}")`
    );
    return {
      status: 200,
      message: "Изменения сохранены успешно",
      id,
    };
  }
  async deletePowderPoint(data, accessToken) {
    const userData = tokenService.validAccessToken(accessToken);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const isActivated = await this.isActivated(userData.email);
    if (userData.role !== "admin" || isActivated[0].isActivated !== 1) {
      return {
        status: 400,
        message: "У вас нет прав на изменение",
      };
    }
    this.connect.query(`DELETE FROM powderPoint WHERE id="${data.id}"`);
    return {
      status: 200,
      message: "Изменения сохранены успешно",
    };
  }
}

module.exports = new AdminService();
