const productService = require("../services/product.service");

exports.create = (req, res, next) => {
  productService
    .create(req.user.id, req.body)
    .then((data) =>
      res.status(201).json(data)
    )
    .catch(next);
};

exports.getAll = (req, res, next) => {
  productService
    .getAll()
    .then((data) => res.status(200).json(data))
    .catch(next);
};

exports.getById = (req, res, next) => {
  productService
    .getById(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch(next);
};

exports.getSellerProducts = (req, res, next) => {
  productService
    .sellerProducts(req.user.id)
    .then((data) => res.status(200).json(data))
    .catch(next);
};

exports.update = (req, res, next) => {
  productService
    .update(req.user.id, req.params.id, req.body)
    .then((data) => res.status(200).json(data))
    .catch(next);
};

exports._delete = (req, res, next) => {
  productService
    .delete(req.user.id, req.params.id)
    .then(() => res.json({ message: "Product deleted successfully" }))
    .catch(next);
};

exports.buyProduct = (req, res, next) => {
  productService
    .buyProduct(req.user.id, req.params.id, req.body.amount)
    .then((data) => res.status(200).json(data))
    .catch(next);
};
