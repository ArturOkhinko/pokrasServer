const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const tokenService = require("./token-service.js");
const mysql = require("mysql");
const dotenv = require("dotenv");
const mailService = require("./mail-service.js");
const ApiError = require("../Api-err/api-error.js");
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
    this.connect.query("ALTER TABLE ");
  }
  async registration(email, password, code) {
    const isValidCode = code === process.env.ADMIN_CODE;
    let role;
    isValidCode ? (role = "admin") : (role = "user");

    const selectUsers = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT * FROM users WHERE email = "${email}"`,
          (err, res) => {
            if (res[0]) {
              resolve({
                status: 400,
                message: `Пользователь с ${email} уже существует`,
              });
            }
            resolve({
              status: 200,
            });
          }
        );
      });
    };

    const send = await selectUsers();

    if (send.status === 400) {
      throw ApiError.BedRequest(send.message, [send.error]);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();
    const userId = v4();
    const tokens = tokenService.generateToken({
      email,
      activationLink,
      role,
    });
    const link = `${process.env.URL_API}/activated/:${activationLink}`;
    try {
      await mailService.sendActivationMail(email, link);
    } catch (e) {
      throw ApiError.EmailError();
    }

    this.connect.query(
      `
            INSERT users(id, email, password, activatedLink, roles) 
            VALUES("${userId}", "${email}", "${hashPassword}", "${activationLink}", "${role}")
            `
    );
    this.connect.query(
      `
            INSERT tokens(id, refreshToken, accessToken)
            VALUES ("${userId}", "${tokens.refreshToken}", "${tokens.accessToken}")
            `
    );

    return {
      ...tokens,
      role,
    };
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
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validRefreshToken(refreshToken);
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    const selectRefresh = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `SELECT id FROM users WHERE email="${userData.email}"`,
          (err, res) => {
            if (err || !res[0]) {
              resolve({
                error: "UnauthorisedError",
              });
              return;
            }
            const tokens = tokenService.generateToken({
              email: userData.email,
              role: userData.role,
            });
            this.connect.query(
              `UPDATE tokens SET accessToken = "${tokens.accessToken}" WHERE id="${res[0].id}"`
            );
            resolve({
              accessToken: tokens.accessToken,
            });
          }
        );
      });
    };
    return selectRefresh();
  }
  async login(email, password) {
    const selectUser = () => {
      return new Promise((resolve, reject) => {
        this.connect.query(
          `
                      SELECT id, email, roles, password FROM users WHERE email="${email}"
                  `,
          (err, res) => {
            if (!res[0]) {
              resolve({
                error: `Пользователя ${email} не существует`,
              });
              return;
            }
            if (res[0]) {
              resolve({
                role: res[0].roles,
                id: res[0].id,
                password: res[0].password,
                email: res[0].email,
              });
            }
          }
        );
      });
    };

    const updateTokens = (tokens, res) => {
      this.connect.query(
        `
                UPDATE tokens SET refreshToken="${tokens.refreshToken}", accessToken="${tokens.accessToken}" WHERE id="${res.id}"
            `
      );
    };

    return selectUser().then(async (res) => {
      if (res.error) {
        throw ApiError.BedRequest(res.error);
      }
      const isPassword = await bcrypt.compare(password, res.password);

      if (!isPassword) {
        throw ApiError.BedRequest(res.error);
      }

      const tokens = tokenService.generateToken({
        email: res.email,
        role: res.role,
      });
      updateTokens(tokens, res);

      return {
        ...tokens,
        role: res.role,
        id: res.id,
      };
    });
  }
  async logout(refreshToken) {
    const userData = tokenService.validRefreshToken(refreshToken);
    return userData;
  }
}

module.exports = new UserService();
