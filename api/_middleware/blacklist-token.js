const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist-token.model");
const UserLogin = require("../models/user-login.model");
const { secret } = require("../_helpers/config");

async function blacklistToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) throw "Unauthorized";

  const found = await BlacklistToken.findOne({ token: token });

  if (found) {
    jwt.verify(token, secret, async (err, payload) => {
      const login = await UserLogin.findOne({ user_id: payload.id, token_id: payload.token_id });
      login.logged_out = true;
      login.token_deleted = true;
      await login.save();
    });
    details = {
      Status: "Failure",
      Details: "Token blacklisted. Cannot use this token.",
    };

    return res.status(401).json(details);
  } else {
    jwt.verify(token, secret, async (err, payload) => {
      if (err) return res.status(403);
      if (payload) {
        const login = await UserLogin.findOne({ user_id: payload.id, token_id: payload.token_id });
        if (login.token_deleted == true) {
          login.logged_out = true;
          await login.save();
          const blacklist_token = await BlacklistToken.create({
            token: token,
          });
        } else {
          login.logged_out = true;
          login.token_deleted = true;
          await login.save();
          const blacklist_token = await BlacklistToken.create({
            token: token,
          });
        }
      }
    });
  }
  next()
}

module.exports = blacklistToken;
