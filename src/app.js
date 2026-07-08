require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes  = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes  = require('./routes/adminRoutes');
const arcoRoutes   = require('./routes/arcoRoutes');

const authMiddleware  = require('./middleware/authMiddleware');
const roleMiddleware  = require('./middleware/roleMiddleware');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');

const { logger } = require('./utils/logger');

const app = express();

//! MIDDLEWARES GLOBALES

// Rate limiting general para toda la API (protege contra scraping masivo)
app.use('/api/', apiLimiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging de peticiones HTTP (sin datos personales)
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
    // No logueamos err.stack completo en producción para evitar fugas de info
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
});

module.exports = app;