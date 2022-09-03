const express = require("express");
const router = express.Router();
const authorize = require("../_middleware/authorize");
const {
  register,
  getAll,
  getById,
  update,
  _delete,
  login,
  deposit,
} = require("../controllers/user.controller");

const {
  registerSchema,
  loginSchema,
  updateSchema,
} = require("../validations/user.validation");

// routes
router.post("/login", loginSchema, login);
router.post("/register", registerSchema, register);
router.get("/", authorize(), getAll);
router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.put("/", authorize("buyer"), deposit);
router.delete("/:id", authorize(), _delete);

module.exports = router;
