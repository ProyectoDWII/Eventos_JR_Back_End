/**
 * @file rateLimiter.js
 * @description Middlewares de rate limiting para proteger endpoints críticos
 * contra ataques de fuerza bruta y scraping masivo de datos.
 */

const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

/**
 * Manejador personalizado cuando se supera el límite.
 * Registra el intento en el log de auditoría.
 */
const onLimitReached = (req, res, next, options) => {
  logger.warn('RATE_LIMIT_EXCEEDED', {
    type: 'SECURITY',
    ip: req.ip,
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent'),
  });
};

/**
 * Rate limiter estricto para endpoints de autenticación.
 * Máximo 10 intentos cada 15 minutos por IP.
 * Protege contra ataques de fuerza bruta en login/register.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    success: false,
    message: 'Demasiados intentos. Por favor espera 15 minutos antes de intentar de nuevo.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    onLimitReached(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate limiter general para la API.
 * Máximo 100 peticiones cada 10 minutos por IP.
 * Protege contra scraping masivo del padrón de datos.
 */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP. Por favor intenta más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    onLimitReached(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate limiter para endpoints ARCO (muy sensibles).
 * Máximo 5 peticiones por hora por IP.
 */
const arcoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: {
    success: false,
    message: 'Límite de solicitudes ARCO alcanzado. Intenta de nuevo en una hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    onLimitReached(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = { authLimiter, apiLimiter, arcoLimiter };
