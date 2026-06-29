/**
 * @file database.js
 * @description Configuración y establecimiento de la conexión con MongoDB usando Mongoose.
 */

const mongoose = require('mongoose');

/**
 * Conecta la aplicación a la base de datos MongoDB.
 * Utiliza la variable de entorno MONGO_URI, o una por defecto en localhost.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventos_jr';
    
    // Conexión a MongoDB
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`[Database] MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
