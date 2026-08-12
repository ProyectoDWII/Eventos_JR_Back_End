require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Middlewares propios
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');

// Rutas
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');
const packageRoutes = require('./routes/packageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const aplicationRoutes = require('./routes/aplicationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const photographerRoutes = require('./routes/photographerRoutes');

const app = express();

// ─── Middlewares Globales ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(generalLimiter);

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/applications', aplicationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/photographer', photographerRoutes);

// ─── Ruta raíz de prueba ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 API de Eventos JR funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      client: '/api/client',
      admin: '/api/admin',
      packages: '/api/packages',
      services: '/api/services',
      applications: '/api/applications',
      chat: '/api/chat',
      notifications: '/api/notifications',
      photographer: '/api/photographer',
    },
  });
});

// ─── Manejo de errores ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
