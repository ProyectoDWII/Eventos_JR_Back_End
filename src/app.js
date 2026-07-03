require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

//! MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! RUTAS

app.use('/api/auth', authRoutes);

app.use('/api/client', authMiddleware, roleMiddleware(['client']), clientRoutes);

app.use('/api/admin', authMiddleware, roleMiddleware(['admin']), adminRoutes);

//! MIDDLEWARE DE ERRORES (SIEMPRE AL FINAL) 
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.stack);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

module.exports = app;