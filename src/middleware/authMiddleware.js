const { verifyToken } = require('../service/tokenService');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token de las cookies o del header Authorization (para Postman)
    const token = req.cookies?.token || 
                  (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

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