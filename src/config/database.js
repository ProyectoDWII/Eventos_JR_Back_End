const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    });
    
    console.log(`✅ MongoDB conectado exitosamente`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Colecciones en la base de datos:`);
    if (collections.length === 0) {
      console.log(`  (No hay colecciones, la base de datos está vacía)`);
    } else {
      collections.forEach(c => console.log(`  - ${c.name}`));
    }
    console.log('---------------------------');
    
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB:`, error.message);
    console.error(`📝 URI usada: ${process.env.MONGODB_URI}`);
    process.exit(1);
  }
};

module.exports = connectDB;