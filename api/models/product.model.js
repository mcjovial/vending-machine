const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validateCost = (e) => {
  if (e === 0 || e % 5 !== 0) return false;
  else return true;
};

const validateAmount = (e) => {
  //description not explaing how many etc. So I assume the vending machine slots max. 10 per slots.

  if (e > 10) return false;
  else return true;
};

const productSchema = new Schema({
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  productName: {
    type: String,
    required: [true, " {PATH} is required."],
    unique: true,
    max: [50, "max length for {PATH} is ({MAXLENGTH})"], //not considering led screen size as this is a demo
    min: 2,
  },
  description: {
    type: String,
    required: [true, " {PATH} is required."],
    max: [100, "max length for {PATH} is ({MAXLENGTH})"],
    min: 5,
  },
  cost: {
    type: Number,
    default: 0,
    validate: [
      validateCost,
      "Cost of a product should multiples of 5 and can not be for free",
    ],
  },
  amountAvailable: {
    type: Number,
    default: 0,
    validate: [validateAmount, "Product amounts can not be more then 10pcs."],
    min: 0,
    max: 10,
  },
  sales: {
    type: Number,
    default: 0,
    min: 0,
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema)

module.exports = Product;
