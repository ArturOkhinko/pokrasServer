const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const tokenService = require("./token-service.js");
const mysql = require("mysql");
const dotenv = require("dotenv");
const mailService = require("./mail-service.js");
dotenv.config();
class UserService {
  constructor() {
    this.connect = mysql.createPool({
      connectionLimit: 50,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
  }
  async registration(email, password, code) {
    try {
      const isValidCode = code === process.env.ADMIN_CODE;
      let role;
      isValidCode ? (role = "admin") : (role = "user");
      const selectUsers = () => {
        return new Promise((resolve, reject) => {
          this.connect.query(`SELECT * FROM users`, (err, res) => {
            if (err) {
              resolve({
                status: 400,
                message: "Ошибка запроса к базе данных",
              });
              return;
            }
            if (res.filter((element) => email === element.email)[0]) {
              resolve({
                status: 400,
                message: `Пользователь с ${email} уже существует`,
              });
            }
            resolve({
              status: 200,
              message: `Письмо отправленно на почту ${email}`,
            });
          });
        });
      };
      const send = await selectUsers().then((res) => res);
      if (send.status === 400) {
        return send;
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const activationLink = v4();
      const userId = v4();
      const tokens = tokenService.generateToken({
        email,
        activationLink,
        role,
      });
      const insertUsers = () => {
        return new Promise((resolve, reject) => {
          this.connect.query(
            `
            INSERT users(id, email, password, activatedLink, refreshToken, roles) 
            VALUES("${userId}", "${email}", "${hashPassword}", "${activationLink}", "${tokens.refreshToken}", "${role}")
            `,
            (err, res) => {
              resolve({ id: userId, refreshToken: tokens.refreshToken });
            }
          );
        });
      };
      const insertTokens = (userData) => {
        this.connect.query(
          `
            INSERT tokens(id, refreshToken, accessToken)
            VALUES ("${userData.id}", "${userData.refreshToken}", "${userData.accessToken}")
            `
        );
      };
      insertUsers().then((res) => insertTokens(res));

      const link = `${process.env.URL_API}/activated/:${activationLink}`;
      const status = mailService.sendActivationMail(email, link);
      if (status.status === 400) {
        return {
          status: 400,
          message: "Ошибка отправки письма",
        };
      }
      return {
        ...tokens,
        activationLink,
        role,
      };
    } catch (e) {
      return null;
    }
  }
  async active(activationLink) {
    const sql = `UPDATE users SET isActivated=1 WHERE activatedLink="${activationLink}"`;
    return new Promise((resolve, reject) => {
      this.connect.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          resolve({ status: 400, message: "Ссылка не соответствует" });
        }
        if (res) {
          console.log(res);
          resolve({ status: 200, message: "Почта подтверждена" });
        }
      });
    });
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const userData = tokenService.validRefreshToken(refreshToken);
    console.log("refreshToken", refreshToken);
    console.log("userData", userData);
    if (!userData) {
      return {
        status: 400,
        message: "Пользователь не авторизован",
      };
    }
    const selectRefresh = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT id, email, activatedLink, roles FROM users WHERE refreshToken="${refreshToken}"`,
          (err, res) => {
            if (err || !res[0]) {
              console.log("res", res[0]);
              resolve({
                status: 400,
                message: "Залогиниться",
              });
              return;
            }
            const tokens = tokenService.generateToken({
              email: res[0].email,
              activationLink: res[0].activatedLink,
              role: res[0].roles,
            });
            this.connect.query(
              `UPDATE FROM users SET refreshToken="${tokens.refreshToken} WHERE id="${res[0].id}"`
            );
            this.connect.query(
              `UPDATE FROM tokens SET refreshToken="${tokens.refreshToken}" WHERE id="${res[0].id}"`,
              (err, res) => {
                if (err) {
                  console.log(err);
                }
                if (res) {
                  console.log(res);
                }
              }
            );
            resolve({
              ...tokens,
              email: res[0].email,
              role: res[0].roles,
            });
          }
        );
      });
    };
    return selectRefresh();
  }
  async login(email, password, code) {
    let role = "user";
    const isValidCode = code === process.env.ADMIN_CODE;
    if (!isValidCode) {
      return {
        status: 400,
        message: "Неверный код",
      };
    }
    const selectUser = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `
                      SELECT * FROM users WHERE email="${email}"
                  `,
          (err, res) => {
            if (err) {
              resolve({
                status: 400,
              });
              return;
            }
            if (!res[0]) {
              resolve({
                status: 400,
                message: `Пользователя ${email} не существует`,
              });
              return;
            }
            if (res[0]) {
              resolve(res[0]);
            }
          }
        );
      });
    };
    selectUser().then((res) => {
      if (res.roles === "admin") {
        role = "admin";
      }
    });
    if (!isValidCode && role === "admin") {
      return {
        status: 400,
        message: "Неверный код",
      };
    }
    const updateRefreshToken = (tokens) => {
      this.connect.query(
        `
                UPDATE users SET refreshToken="${tokens.refreshToken}" WHERE email="${email}"
                `,
        (err, res) => {
          if (err) {
            console.log(err);
          }
          if (res) {
            console.log(res);
          }
        }
      );
    };
    const updateTokens = (tokens, res) => {
      this.connect.query(
        `
                UPDATE tokens SET refreshToken="${tokens.refreshToken}", accessToken="${tokens.accessToken}" WHERE id="${res.id}"
            `
      );
    };
    const selectTokens = (id) => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `
                   SELECT * FROM tokens WHERE id="${id}"
                `,
          (err, res) => {
            resolve(res);
          }
        );
      });
    };
    return selectUser().then(async (res) => {
      if (res.status) {
        return {
          status: res.status,
          message: res.message,
        };
      }
      const isPassword = bcrypt.compare(password, res.password);

      const status = await isPassword.then((res) => {
        if (!res) {
          return {
            status: 400,
            message: "Неверный пароль",
          };
        }
        return {
          status: 200,
        };
      });
      if (status.status === 400) {
        return {
          status: status.status,
          message: status.message,
        };
      }
      const tokens = tokenService.generateToken({
        email: res.email,
        activationLink: res.activationLink,
        role,
      });
      updateTokens(tokens, res);
      selectTokens(res.id).then((user) => {
        if (user[0]) {
          updateRefreshToken(tokens);
        }
      });

      return {
        ...tokens,
        role,
      };
    });
  }
  async logout(refreshToken) {
    const userData = tokenService.validRefreshToken(refreshToken);
    return userData;
  }
}

module.exports = new UserService();
