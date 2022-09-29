const Product = require("../models/product.model");
const db = require("../_helpers/db");
const User = require("../models/user.model");
const { getUser } = require("./user.service");

async function create(id, params) {
  params.seller_id = id;
  await checkDuplicate(params)
  const product = await Product.create(params);
  return {
    product,
    message: "Product created successfully",
  };
}

async function getAll() {
  return await Product.find();
}

async function getById(id) {
  return await getProduct(id);
}

async function sellerProducts(id) {
  return await Product.find({ seller_id: id });
}

async function update(sellerId, productId, params) {
  // await checkDuplicate(params);
  if (params.cost === 0 || params.cost % 5 !== 0) throw "Cost of a product should multiples of 5 and can not be for free"
  if (params.amountAvailable > 10) throw "Product amounts can not be more then 10pcs."
  
  await checkSeller(sellerId, productId);
  await getProduct(productId);
  return await Product.findOneAndUpdate({ _id: productId }, params, {
    new: true,
  });
}

async function _delete(sellerId, productId) {
  await checkSeller(sellerId, productId);
  const product = await getProduct(productId);
  product.remove();
}

async function buyProduct(buyerId, productId, amount) {
  const user = await getUser(buyerId);
  const product = await getProduct(productId);
  const { cost, amountAvailable } = product;

  const total_cost = cost * amount;
  let change = user.deposit - total_cost;

  if (amountAvailable === 0) throw `Sorry this Product Is Not Available`;
  if (amountAvailable < amount)
    throw `Insufficient Product Numbers. Currently max: ${amountAvailable}`;
  if (user.deposit < total_cost)
    throw `Insufficient Deposit Balance. Requires: ¢${total_cost}. Available: ¢${user.deposit}`;

  //calculation
  let change_arr = [100, 50, 20, 10, 5];
  let change_safe = change;
  let change_description;
  let s = [];

  if (change % 10 !== 0 || change === 5) {
    s.push([5, 1]);
    change = change - 5;
  }

  if (change !== 0) {
    let amount = [...change_arr]
      .filter((x) => x <= change)
      .sort((x, y) => y - x);
    let highest = amount.shift();
    let c = Math.floor(change / highest);
    s.push([highest, c]);
    let current = change - highest * c;
    if (current !== 0) {
      for (let i = 0; i < amount.length; i++) {
        let d = Math.floor(current / amount[i]);
        if (d >= 1) {
          s.push([amount[i], d]);
          current = current - amount[i] * d;
        }
      }
    }
  }

  change_description = s.sort((a, b) => b[0] - a[0]);

  const sales = await Product.findByIdAndUpdate(
    productId,
    { $inc: { amountAvailable: -amount, sales: amount } },
    { new: true }
  );

  const balance = await User.findByIdAndUpdate(
    buyerId,
    { $inc: { deposit: -total_cost } },
    { new: true }
  );

  return {
    status: true,
    message: "Thank you. Your purchase was successful!",
    total_spent: `¢${total_cost}`,
    products_purchased: `${product.productName} [${amount} units]`,
    change: `¢${change_safe}`,
    change_description,
  };
}

async function getProduct(id) {
  if (!db.isValidId(id)) throw "Product not found";
  const product = await Product.findById(id);
  if (!product) throw "Product not found";
  return product;
}

async function checkDuplicate(params) {
  const productExist = await Product.findOne({
    productName: params.productName,
  });
  if (productExist) throw `${productExist.productName} aready exists`;
}

async function checkSeller(sellerId, productId) {
  const product = await Product.findById(productId);

  if (!product.seller_id.toString() === sellerId)
    throw "Sorry only the product's seller are authorized for this action!";
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: _delete,
  buyProduct,
  sellerProducts,
};
