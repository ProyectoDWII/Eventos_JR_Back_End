require('dotenv').config();
const express        = require('express');
const cors           = require('cors');
const cookieParser   = require('cookie-parser');
const helmet         = require('helmet');
const mongoSanitize  = require('express-mongo-sanitize');

const authRoutes  = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes  = require('./routes/adminRoutes');
const arcoRoutes   = require('./routes/arcoRoutes');

const authMiddleware  = require('./middleware/authMiddleware');
const roleMiddleware  = require('./middleware/roleMiddleware');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { sanitizeInputs } = require('./middleware/validationMiddleware');

const { logger } = require('./utils/logger');

const app = express();

//! MIDDLEWARES GLOBALES
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", 'data:'],
      connectSrc:  ["'self'"],
      fontSrc:     ["'self'"],
      objectSrc:   ["'none'"],
      frameAncestors: ["'none'"], 
    },
  },
  frameguard: { action: 'deny' }, 
}));

app.use('/api/', apiLimiter);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitized = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    if (JSON.stringify(sanitized) !== JSON.stringify(req.body)) {
      logger.warn('NOSQL_INJECTION_ATTEMPT', {
        type: 'SECURITY',
        ip:   req.ip,
        path: req.path,
      });
    }
    req.body = sanitized;
  }
  next();
});

app.use(sanitizeInputs);


app.use((req, res, next) => {
  logger.debug('HTTP_REQUEST', {
    method: req.method,
    path:   req.path,
    ip:     req.ip,
  });
  next();
});

//! RUTAS

// Auth: con rate limiter estricto para login/register
app.use('/api/auth', authLimiter, authRoutes);

// ARCO: derechos del usuario sobre sus datos (autenticación interna en la ruta)
app.use('/api/arco', arcoRoutes);

// Rutas de cliente
app.use('/api/client', authMiddleware, roleMiddleware(['client']), clientRoutes);

// Rutas de administrador
app.use('/api/admin', authMiddleware, roleMiddleware(['admin']), adminRoutes);

//! MIDDLEWARE DE ERRORES (SIEMPRE AL FINAL)
app.use((err, req, res, next) => {
  logger.error('GLOBAL_ERROR', {
    method:  req.method,
    path:    req.path,
    error:   err.message,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
});

module.exports = app;