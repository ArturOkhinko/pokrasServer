const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
class TokenService {
  constructor() {
    this.connect = mysql.createPool({
      connectionLimit: 50,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
  }
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {
      expiresIn: "30m",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  validAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS);
      return userData;
    } catch (e) {}
  }
  validRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH);
      return userData;
    } catch (e) {}
  }
  removeTokens(refreshToken) {
    try {
    } catch (e) {
      return {
        staus: 400,
      };
    }
  }
}

module.exports = new TokenService();
