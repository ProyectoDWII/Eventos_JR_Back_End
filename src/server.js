// Importar dependencias
const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

// Inicializar Express
const app = require('./app');

// Conectar BD
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});