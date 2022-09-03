const Product = require("../models/product.model");
const db = require("_helpers/db");
const User = require("../models/user.model");

async function create(id, params) {
  params.seller_id = id
  await Product.create(params)
}

async function getAll() {
  return await Product.find()
}

async function getById(id) {
  return await getProduct(id)
}

async function update(sellerId, productId, params) {
  await checkSeller(sellerId, productId)
  await getProduct(productId)
  return await Product.findOneAndUpdate({ _id: productId }, params, { new: true });
}

async function _delete(sellerId, productId) {
  await checkSeller(sellerId, productId)
  const product = await getProduct(productId)
  product.remove();
}

async function getProduct(id) {
  if (!db.isValidId(id)) throw "Product not found";
  const product = await Product.findById(id);
  if (!product) throw "Product not found";
  return product;
}

async function checkSeller(sellerId, productId) {
  const product = await Product.findById(productId)

  if (!product.seller_id.toString() === sellerId) throw "Sorry only the product's seller are authorized for this action!"
}


module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: _delete
}