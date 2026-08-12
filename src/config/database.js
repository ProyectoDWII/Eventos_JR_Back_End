const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB usando la URI del .env
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
