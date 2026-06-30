const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

/* Genera un token JWT para un usuario */
const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/* Verifica un token JWT */
const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};