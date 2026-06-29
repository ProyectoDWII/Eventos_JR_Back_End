/**
 * @file contractValidators.js
 * @description Esquemas de validación básica para la entidad de Contrato (Contract).
 */

const Joi = require('joi');

/**
 * Esquema de validación para crear un contrato
 */
const createContractSchema = Joi.object({
  solicitud: Joi.string().required(),
  client: Joi.string().required(),
  totalAmount: Joi.number().min(0).required(),
  paymentStatus: Joi.string().valid('pending', 'partial', 'paid').default('pending'),
  terms: Joi.string().required(),
  pdfUrl: Joi.string().allow('').optional(),
  status: Joi.string().valid('draft', 'active', 'signed', 'completed', 'cancelled').default('draft'),
  signedAt: Joi.date().allow(null).optional(),
});

/* Esquema de validación para actualizar un contrato*/
const updateContractSchema = Joi.object({
  solicitud: Joi.string().optional(),
  client: Joi.string().optional(),
  totalAmount: Joi.number().min(0).optional(),
  paymentStatus: Joi.string().valid('pending', 'partial', 'paid').optional(),
  terms: Joi.string().optional(),
  pdfUrl: Joi.string().allow('').optional(),
  status: Joi.string().valid('draft', 'active', 'signed', 'completed', 'cancelled').optional(),
  signedAt: Joi.date().allow(null).optional(),
});

module.exports = {
  createContractSchema,
  updateContractSchema,
};
