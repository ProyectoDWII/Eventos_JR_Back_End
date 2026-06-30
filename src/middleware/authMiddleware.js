const { verifyToken } = require('../service/tokenService');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar token
    const decoded = verifyToken(token);
    
    // 3. Adjuntar el usuario decodificado a la request
    req.user = decoded; // { id, email, role, iat, exp }

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