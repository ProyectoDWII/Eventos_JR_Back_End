const Joi = require('joi');

/**
 * Validación para registro de usuario
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede superar 100 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El correo no es válido',
    'any.required': 'El correo es obligatorio',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
  phone: Joi.string().optional().allow(''),
  role: Joi.string().valid('admin', 'client').default('client'),
});

/**
 * Validación para inicio de sesión
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo no es válido',
    'any.required': 'El correo es obligatorio',
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es obligatoria',
  }),
});

/**
 * Validación para actualización de usuario
 */
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().allow(''),
  active: Joi.boolean().optional(),
});

module.exports = { registerSchema, loginSchema, updateUserSchema };
