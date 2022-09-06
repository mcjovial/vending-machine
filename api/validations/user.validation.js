const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");


exports.loginSchema = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
};

exports.registerSchema = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    role: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
};

exports.depositSchema = (req, res, next) => {
  const schema = Joi.object({
    deposit: Joi.number().required(),
  });
  validateRequest(req, next, schema);
};


exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().empty(""),
    role: Joi.string().empty(""),
    password: Joi.string().min(6).empty(""),
  });
  validateRequest(req, next, schema);
};

