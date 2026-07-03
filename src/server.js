require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

console.log('  PORT:', process.env.PORT || '3000 (default)');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? 'Definido' : 'NO DEFINIDO');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'Definido' : 'NO DEFINIDO');
console.log('  JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '7d (default)');
console.log('---------------------------');

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});