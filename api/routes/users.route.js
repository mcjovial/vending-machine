const router = require("express").Router();
const authorize = require("../_middleware/authorize");
const {
  register,
  getAll,
  getById,
  update,
  _delete,
  login,
  deposit,
  reset,
  getInfo,
  logoutAll,
  logout,
} = require("../controllers/user.controller");

const {
  registerSchema,
  loginSchema,
  updateSchema,
  depositSchema,
} = require("../validations/user.validation");
const authenticateToken = require("../_middleware/authenticate-token");

// routes
router.post("/login", loginSchema, login);
router.post("/register", registerSchema, register);
router.post("/logout/all", logoutAll);
router.get("/logout", authorize(), authenticateToken, logout);
router.get("/", authorize(), authenticateToken, getAll);
router.get("/info", authorize(), authenticateToken, getInfo);
router.get("/:id", authorize(), authenticateToken, getById);
router.post("/reset", authorize(), authenticateToken, reset);
router.put("/:id", authorize(), authenticateToken, updateSchema, update);
router.put("/", authorize("buyer"), authenticateToken, depositSchema, deposit);
router.delete("/:id", authorize(), authenticateToken, _delete);

module.exports = router;
