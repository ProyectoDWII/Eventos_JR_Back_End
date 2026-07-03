require('dotenv').config();

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

if (!secret) {
  console.error('ERROR: JWT_SECRET no está definido en el archivo .env');
  console.error('Asegúrate de tener un archivo .env en la raíz con:');
  console.error('JWT_SECRET=miclaveultrasecreta123456');
  process.exit(1); 
}

module.exports = {
  secret,
  expiresIn,
};