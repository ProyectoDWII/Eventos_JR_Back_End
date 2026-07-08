const Joi = require('joi');

const createPackageSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  services: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

const updatePackageSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  services: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

module.exports = {
  createPackageSchema,
  updatePackageSchema,
};
