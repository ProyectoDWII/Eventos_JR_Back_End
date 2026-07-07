/**
 * @file ownershipMiddleware.js
 * @description Middleware de protección contra BOLA
 * (Broken Object Level Authorization).
 *
 * Valida que el usuario autenticado solo pueda acceder o modificar
 * sus PROPIOS recursos. Evita que un cliente cambie el :id en la URL
 * para ver datos de otro usuario.
 *
 * Excepción: los administradores sí pueden acceder a cualquier recurso.
 */

const { auditLog, logger } = require('../utils/logger');

/**
 * Middleware que verifica que req.params.id corresponde al usuario autenticado.
 * Solo aplica a roles 'client'; los 'admin' tienen acceso irrestricto.
 */
const validateOwnership = (req, res, next) => {
  try {
    const requestedId    = req.params.id;
    const authenticatedId = req.user?.id?.toString();
    const userRole        = req.user?.role;

    // Los administradores pueden acceder a cualquier recurso
    if (userRole === 'admin') {
      return next();
    }

    // Si no hay ID en params, no aplica este middleware
    if (!requestedId) {
      return next();
    }

    // Verificar que el ID solicitado coincide con el usuario autenticado
    if (requestedId !== authenticatedId) {
      auditLog({
        userId:     authenticatedId,
        role:       userRole,
        action:     'BOLA_ATTEMPT',
        resource:   req.path,
        resourceId: requestedId,
        ip:         req.ip,
        result:     'DENIED',
        detail:     'Intento de acceso a recurso de otro usuario (BOLA)',
      });

      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: no tienes permiso para acceder a este recurso.',
      });
    }

    next();
  } catch (error) {
    logger.error('OWNERSHIP_MIDDLEWARE_ERROR', { error: error.message });
    return res.status(500).json({ success: false, message: 'Error de autorización' });
  }
};

module.exports = { validateOwnership };
