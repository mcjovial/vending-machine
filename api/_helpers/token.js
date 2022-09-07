var jwt = require("jsonwebtoken");
var customId = require("custom-id");
const UserLogin = require("../models/user-login.model");
const { secret } = require("./config");

var createToken = async function (req, user) {
  const token_id = customId({
    user_id: user.id,
    date: Date.now(),
    randomLength: 4,
  });

  var ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const user_logins = await UserLogin.find({
    user_id: user.id,
    token_deleted: false,
    ip_address: ip,
    device: req.headers["user-agent"],
  });

  user_logins.forEach(async (login) => {
    if (login) {
      login.token_deleted = true;
      await login.save();
    }
  });

  const token_secret = customId({
    token_secret: ip,
    date: Date.now(),
    randomLength: 8,
  });

  const token = await UserLogin.create({
    user_id: user.id,
    token_id: token_id,
    token_secret: token_secret,
    ip_address: ip,
    device: req.headers["user-agent"],
  });

  return token_id;
};

module.exports = {
  createToken,
};
