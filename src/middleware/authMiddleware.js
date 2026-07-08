const { verifyToken } = require('../service/tokenService');

const authMiddleware = async (req, res, next) => {
  try {


    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }


    const decoded = verifyToken(token);

    // Adjuntar el usuario decodificado a la request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(500).json({ message: 'Error al autenticar' });
  }
};

module.exports = authMiddleware;