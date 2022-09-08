const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist-token.model");
const UserLogin = require("../models/user-login.model");
const { secret } = require("../_helpers/config");

//MIDDLEWARE TO AUTHENTICATE TOKEN BEFORE ACCESSING PROTECTED ROUTES
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401);


  const found = await BlacklistToken.findOne({ token: token })

    if (found) {
      details = {  message: "Token is invalid hence, blacklisted." };

      return res.status(401).json(details);
    } else {
      jwt.verify(
        token,
        secret,
        async (err, payload) => {
          if (err) return res.status(403);
          if (payload) {
            const login = await UserLogin.findOne({ user_id: payload.id, token_id: payload.token_id });
            if (!login.token) {
              login.token = token
              await login.save();
            }

            if (!login) return res.status(401).json({ message: "Unauthorized!!" })
            if (login.token_deleted == true) {
              const blacklist_token = await BlacklistToken.create({
                token: token,
              });
              return res.status(401);
            }
          }
          req.user.token_id = payload.token_id;
          next();
        }
      );
    }
}

module.exports = authenticateToken;
