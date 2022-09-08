const authorize = require("../_middleware/authorize");
const router = require("express").Router();

const {
  create,
  getAll,
  getById,
  update,
  _delete,
  buyProduct,
  getSellerProducts,
} = require("../controllers/product.controller");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/product.validation");
const authenticateToken = require("../_middleware/authenticate-token");

router.post("/", authorize("seller"), createProductSchema, create);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/seller", authorize(), authenticateToken, getSellerProducts);
router.put("/:id", authorize("seller"), authenticateToken, updateProductSchema, update);
router.delete("/:id", authorize("seller"), authenticateToken, _delete);
router.post("/buy/:id", authorize("buyer"), authenticateToken, buyProduct);

module.exports = router;
