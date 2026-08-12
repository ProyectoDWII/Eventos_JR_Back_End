const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { errorResponse } = require('../utils/formatters');

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario al request
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'No autenticado. Por favor inicia sesión.', 401);
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario en BD
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'El usuario al que pertenece este token ya no existe.', 401);
    }

    if (!user.active) {
      return errorResponse(res, 'Tu cuenta está desactivada. Contacta al administrador.', 401);
    }

    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token inválido.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 401);
    }
    return errorResponse(res, 'Error de autenticación.', 500);
  }
};

module.exports = { protect };
