const express = require("express");
const usersRoute = require("./users.route");

const router = express.Router();

router.use("/user", usersRoute);

module.exports = router;
