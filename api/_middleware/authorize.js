const jwt = require("express-jwt");
const { secret } = require("../_helpers/config");
const User = require("../models/user.model");
// const authenticateToken = require("./authenticate-token");

module.exports = authorize;

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. ['seller', 'buyer'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret, algorithms: ["HS256"] }),

    // authorize based on user role
    async (req, res, next) => {
      const user = await User.findById(req.user.id);

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user no longer exists or role not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user.role = user.role;
      next();
    },
  ];
}
