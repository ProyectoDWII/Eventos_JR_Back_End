const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación (públicas)
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;