const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'client').default('client'),
  phoneNumber: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('admin', 'client').optional(),
  phoneNumber: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
