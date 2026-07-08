const Joi = require('joi');

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
