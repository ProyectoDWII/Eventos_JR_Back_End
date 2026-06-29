const Joi = require('joi');

/* Esquema de validación para crear una solicitud de evento*/
const createRequestSchema = Joi.object({
  client: Joi.string().required(),
  eventType: Joi.string().required(),
  eventDate: Joi.date().required(),
  location: Joi.string().required(),
  package: Joi.string().allow(null, '').optional(),
  services: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled').default('pending'),
  notes: Joi.string().allow('').optional(),
});

/* Esquema de validación para actualizar una solicitud de evento*/
const updateRequestSchema = Joi.object({
  client: Joi.string().optional(),
  eventType: Joi.string().optional(),
  eventDate: Joi.date().optional(),
  location: Joi.string().optional(),
  package: Joi.string().allow(null, '').optional(),
  services: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled').optional(),
  notes: Joi.string().allow('').optional(),
});

module.exports = {
  createRequestSchema,
  updateRequestSchema,
};
