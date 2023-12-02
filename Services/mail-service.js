const nodemailer = require("nodemailer");
const ApiError = require("../Api-err/api-error");
const email = require("../Email/emailHtml");
const mailPromocode = require("../Email/mailPromocode");
require("dotenv").config();
class MailServer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "",
        text: "",
        html: email(link),
      });
    } catch (e) {
      throw ApiError.EmailError();
    }
  }
  async sendDiscountPromocode(to, code) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "",
        text: "",
        html: mailPromocode(code),
      });
    } catch (e) {
      throw ApiError.EmailError();
    }
  }
}

module.exports = new MailServer();
