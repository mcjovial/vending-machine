const productService = require("../services/product.service");

exports.create = (req, res, next) => {
  productService
    .create(req.user.id, req.body)
    .then(() =>
      res.status(201).json({ message: "Product created successfully" })
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
