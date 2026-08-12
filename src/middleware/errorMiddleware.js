const logger = require('../utils/logger');

/**
 * Middleware global de manejo de errores
 * Debe ser el ÚLTIMO middleware registrado en app.js
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Log del error
  logger.error(`${err.name || 'Error'}: ${err.message}`, { stack: err.stack });

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(statusCode).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  // Error de duplicado en MongoDB (e.g. email único)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Ya existe un registro con ese ${field}.`;
  }

  // ID inválido de Mongoose
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `ID inválido: ${err.value}`;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Tu sesión ha expirado.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
