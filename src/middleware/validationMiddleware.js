const { errorResponse } = require('../utils/formatters');

/**
 * Middleware de validación con esquemas Joi
 * Uso: validate(miSchema) 
 * Puede validar body, params o query
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,    // mostrar todos los errores a la vez
      stripUnknown: true,   // eliminar campos no definidos en el schema
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return errorResponse(res, 'Error de validación', 400, errors);
    }

    // Reemplazar con el valor limpio y validado
    req[source] = value;
    next();
  };
};

module.exports = { validate };
