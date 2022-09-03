const { create, getAll, getById, update, _delete } = require("../controllers/product.controller");
const { createProductSchema, updateProductSchema } = require("../validations/product.validation");
const authorize = require("../_middleware/authorize");

const router = require("express").Router();

router.post("/", authorize('seller'), createProductSchema, create);
router.get("/", getAll);
router.get("/:id", getById)
router.put("/:id", authorize('seller'), updateProductSchema, update)
router.delete("/:id", authorize('seller'), _delete)

module.exports = router;
