const express = require("express");
const { register, getAll, getById, update, _delete, login } = require("../controllers/user.controller");
const authorize = require("../_middleware/authorize");
const { registerSchema, loginSchema, updateSchema } = require("../validations/user.validation");
const router = express.Router();

// routes
router.post('/login', loginSchema, login);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;
