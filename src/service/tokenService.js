const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

//! Genera token
const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

//! Verifica token
const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};