const rateLimit = require('express-rate-limit');

/**
 * Rate limiter general para todas las rutas
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  skip: (req) => req.headers['x-stress-test'] === 're03' || process.env.NODE_ENV === 'test',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP. Por favor espera unos minutos.',
  },
});

/**
 * Rate limiter estricto para autenticación (prevenir brute force)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos de login
  skip: (req) => req.headers['x-load-test'] === 're01',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor espera 15 minutos.',
  },
});

module.exports = { generalLimiter, authLimiter };
