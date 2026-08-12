const Joi = require('joi');

const eventTypes = ['boda', 'quinceañera', 'cumpleaños', 'corporativo', 'graduacion', 'otro'];

/**
 * Validación para crear una solicitud (Application)
 */
const createApplicationSchema = Joi.object({
  package: Joi.string().optional().allow('', null),
  services: Joi.array().items(Joi.string()).optional(),
  eventDate: Joi.date().greater('now').required().messages({
    'any.required': 'La fecha del evento es obligatoria',
    'date.greater': 'La fecha del evento debe ser futura',
  }),
  eventLocation: Joi.string().min(3).required().messages({
    'any.required': 'La ubicación del evento es obligatoria',
  }),
  eventType: Joi.string().valid(...eventTypes).required().messages({
    'any.required': 'El tipo de evento es obligatorio',
    'any.only': `El tipo debe ser uno de: ${eventTypes.join(', ')}`,
  }),
  message: Joi.string().optional().allow(''),
});

/**
 * Validación para crear un contrato (Contract)
 */
const createContractSchema = Joi.object({
  client: Joi.string().required().messages({
    'any.required': 'El cliente es obligatorio',
  }),
  package: Joi.string().optional().allow('', null),
  services: Joi.array().items(Joi.string()).optional(),
  eventDate: Joi.date().required().messages({
    'any.required': 'La fecha del evento es obligatoria',
  }),
  eventLocation: Joi.string().min(3).required().messages({
    'any.required': 'La ubicación del evento es obligatoria',
  }),
  eventType: Joi.string().valid(...eventTypes).required().messages({
    'any.required': 'El tipo de evento es obligatorio',
  }),
  totalPrice: Joi.number().min(0).required().messages({
    'any.required': 'El precio total es obligatorio',
  }),
  deposit: Joi.number().min(0).default(0),
  notes: Joi.string().optional().allow(''),
});

/**
 * Validación para actualizar estado de solicitud
 */
const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pendiente', 'revisando', 'aprobada', 'rechazada')
    .required()
    .messages({
      'any.required': 'El estado es obligatorio',
    }),
  adminNotes: Joi.string().optional().allow(''),
});

module.exports = {
  createApplicationSchema,
  createContractSchema,
  updateApplicationStatusSchema,
};
