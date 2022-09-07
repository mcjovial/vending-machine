require("dotenv").config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mcjovial:19971104Mj@cluster0.z7tsb.mongodb.net/?retryWrites=true&w=majority";
const secret = process.env.JWT_SECRET || "mcJoviAl";
const env = process.env.NODE_ENV || "development";
const emailFrom = process.env.EMAIL_FROM || "info@auth-veri.com";
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

const smtpOptions = {
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_AUTH_USER || "b1c6efdd37e00e",
    pass: process.env.SMTP_AUTH_PASSWORD || "c43a4df99a8c33",
  },
};

module.exports = { uri, secret, emailFrom, smtpOptions, env, port };
