const { errorResponse } = require('../utils/formatters');

/**
 * Middleware de autorización por roles
 * Uso: restrictTo('admin') o restrictTo('admin', 'client')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'No autenticado.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'No tienes permiso para realizar esta acción.',
        403
      );
    }

    next();
  };
};

/**
 * Middleware que verifica que el usuario solo acceda a sus propios recursos
 * (a menos que sea admin)
 */
const isOwnerOrAdmin = (paramIdField = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[paramIdField];
    const userId = req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && userId !== resourceId) {
      return errorResponse(res, 'No puedes acceder a recursos de otro usuario.', 403);
    }

    next();
  };
};

module.exports = { restrictTo, isOwnerOrAdmin };
