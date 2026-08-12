const Joi = require('joi');

/**
 * Validación para crear un servicio
 */
const createServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'El nombre del servicio es obligatorio',
  }),
  description: Joi.string().min(10).required().messages({
    'any.required': 'La descripción es obligatoria',
    'string.min': 'La descripción debe tener al menos 10 caracteres',
  }),
  price: Joi.number().min(0).required().messages({
    'any.required': 'El precio es obligatorio',
    'number.min': 'El precio no puede ser negativo',
  }),
  category: Joi.string()
    .valid('fotografia', 'video', 'album', 'edicion', 'otro')
    .default('fotografia'),
  active: Joi.boolean().default(true),
  imageUrl: Joi.string().uri().optional().allow(''),
});

/**
 * Validación para actualizar un servicio
 */
const updateServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string()
    .valid('fotografia', 'video', 'album', 'edicion', 'otro')
    .optional(),
  active: Joi.boolean().optional(),
  imageUrl: Joi.string().uri().optional().allow(''),
});

module.exports = { createServiceSchema, updateServiceSchema };
