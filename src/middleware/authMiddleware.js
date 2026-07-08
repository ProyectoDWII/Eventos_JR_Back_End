const { verifyToken } = require('../service/tokenService');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token: primero desde la cookie HttpOnly, luego desde el header Authorization
    //    La cookie es usada por el frontend (navegador).
    //    El header es el fallback para Postman y pruebas directas de la API.
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    // Verificar token
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