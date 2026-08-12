const Joi = require('joi');

/**
 * Validación para crear un paquete
 */
const createPackageSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'El nombre del paquete es obligatorio',
  }),
  description: Joi.string().min(10).required().messages({
    'any.required': 'La descripción es obligatoria',
    'string.min': 'La descripción debe tener al menos 10 caracteres',
  }),
  price: Joi.number().min(0).required().messages({
    'any.required': 'El precio es obligatorio',
    'number.min': 'El precio no puede ser negativo',
  }),
  services: Joi.array().items(Joi.string()).optional(),
  duration: Joi.number().min(1).required().messages({
    'any.required': 'La duración en horas es obligatoria',
  }),
  photos: Joi.number().min(0).default(0),
  active: Joi.boolean().default(true),
  imageUrl: Joi.string().uri().optional().allow(''),
});

/**
 * Validación para actualizar un paquete
 */
const updatePackageSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).optional(),
  price: Joi.number().min(0).optional(),
  services: Joi.array().items(Joi.string()).optional(),
  duration: Joi.number().min(1).optional(),
  photos: Joi.number().min(0).optional(),
  active: Joi.boolean().optional(),
  imageUrl: Joi.string().uri().optional().allow(''),
});

module.exports = { createPackageSchema, updatePackageSchema };
