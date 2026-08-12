const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para el usuario
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verifica y decodifica un token JWT
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Genera la respuesta de autenticación con el token
 */
const createTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  return res.status(statusCode).json({
    success: true,
    token,
    data: userData,
  });
};

module.exports = { generateToken, verifyToken, createTokenResponse };
