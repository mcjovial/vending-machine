const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");

exports.createProductSchema = (req, res, next) => {
  const schema = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    cost: Joi.number().required(),
    amountAvailable: Joi.number().required(),
  });
  validateRequest(req, next, schema);
};

exports.updateProductSchema = (req, res, next) => {
  const schema = Joi.object({
    productName: Joi.string().empty(""),
    description: Joi.string().empty(""),
    cost: Joi.number().empty(""),
    amountAvailable: Joi.number().empty(""),
  });
  validateRequest(req, next, schema);
};
