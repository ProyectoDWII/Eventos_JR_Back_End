const { logger } = require('../utils/logger');

// Patrones de payloads XSS comunes que deben ser bloqueados
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<img[^>]+onerror\s*=/gi,
  /<svg[^>]+onload\s*=/gi,
  /javascript\s*:/gi,
  /<body[^>]+onload\s*=/gi,
  /on\w+\s*=\s*["']?[^"'>]*/gi, 
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
];

const containsXSS = (value) => {
  if (typeof value !== 'string') return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(value));
};

const stripHtmlTags = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>/g, '').trim();
};

const sanitizeObject = (obj) => {
  let hasXSS = false;
  const clean = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === 'string') {
      if (containsXSS(value)) {
        hasXSS = true;
      }
      clean[key] = stripHtmlTags(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nested = sanitizeObject(value);
      clean[key] = nested.clean;
      if (nested.hasXSS) hasXSS = true;
    } else {
      clean[key] = value;
    }
  }

  return { clean, hasXSS };
};

const sanitizeInputs = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object') return next();

  const { clean, hasXSS } = sanitizeObject(req.body);

  if (hasXSS) {
    logger.warn('XSS_ATTEMPT_BLOCKED', {
      type:   'SECURITY',
      ip:     req.ip,
      path:   req.path,
      method: req.method,
    });

    return res.status(400).json({
      success: false,
      message: 'Contenido no permitido: se detectaron caracteres o etiquetas no válidas en los datos enviados.',
    });
  }

  // Reemplazar el body con la versión sanitizada
  req.body = clean;
  next();
};

const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors:  errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { sanitizeInputs, handleValidationErrors };
