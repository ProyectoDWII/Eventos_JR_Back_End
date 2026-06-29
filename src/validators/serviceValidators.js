const Joi = require('joi');

/* Esquema de validación para crear un servicio*/
const createServiceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('photography', 'catering', 'music', 'decoration', 'other').required(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

/* Esquema de validación para actualizar un servicio*/
const updateServiceSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().valid('photography', 'catering', 'music', 'decoration', 'other').optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};
