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
} = require("../controllers/user.controller");

const {
  registerSchema,
  loginSchema,
  updateSchema,
  depositSchema,
} = require("../validations/user.validation");

// routes
router.post("/login", loginSchema, login);
router.post("/register", registerSchema, register);
router.get("/", authorize(), getAll);
router.get("/info", authorize(), getInfo);
router.get("/:id", authorize(), getById);
router.post("/reset", authorize(), reset);
router.put("/:id", authorize(), updateSchema, update);
router.put("/", authorize("buyer"), depositSchema, deposit);
router.delete("/:id", authorize(), _delete);

module.exports = router;
