const express = require("express");
const usersRoute = require("./users.route");
const productsRoute = require("./product.route");

const router = express.Router();

router.use("/user", usersRoute);
router.use("/product", productsRoute);

module.exports = router;
