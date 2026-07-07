/**
 * @file arcoController.js
 * @description Controlador para ejercer los derechos ARCO:
 * - Acceso:       El usuario solicita una copia de todos sus datos personales.
 * - Rectificación: El usuario corrige sus datos (ya cubierto en userController).
 * - Cancelación:  El usuario solicita la eliminación de sus datos (soft delete + anonimización diferida).
 * - Oposición:    El usuario se opone a cierto tratamiento de sus datos (ej. marketing).
 */

const User = require('../models/user');
const { auditLog, logger } = require('../utils/logger');

/**
 * ACCESO – El usuario solicita un reporte con todos sus datos personales almacenados.
 * El backend debe responder con los campos mínimos necesarios.
 * @route GET /api/arco/acceso
 */
exports.solicitarAcceso = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    auditLog({
      userId,
      role:       req.user.role,
      action:     'ARCO_ACCESS',
      resource:   'users',
      resourceId: userId,
      ip:         req.ip,
      result:     'SUCCESS',
      detail:     'El usuario ejerció su derecho de Acceso a sus datos personales',
    });

    return res.status(200).json({
      success: true,
      message: 'Datos personales almacenados en el sistema',
      data: {
        id:          user._id,
        name:        user.name,
        email:       user.email,
        phoneNumber: user.phoneNumber || null,
        role:        user.role,
        status:      user.status,
        createdAt:   user.createdAt,
        updatedAt:   user.updatedAt,
      },
      aviso: 'Tus datos son tratados únicamente para las finalidades de la plataforma Eventos JR. Consulta el Aviso de Privacidad para más información.',
    });

  } catch (error) {
    logger.error('ARCO_ACCESS_ERROR', { error: error.message, userId: req.user?.id });
    return res.status(500).json({ success: false, message: 'Error al procesar solicitud de acceso' });
  }
};

/**
 * CANCELACIÓN – El usuario solicita la eliminación de su cuenta y datos.
 * Se realiza un soft delete inmediato. La anonimización permanente ocurre
 * automáticamente a los 30 días mediante el job programado.
 * @route DELETE /api/arco/cancelacion
 */
exports.solicitarCancelacion = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (user.deletedAt) {
      return res.status(400).json({
        success: false,
        message: 'Tu solicitud de cancelación ya fue procesada anteriormente.',
      });
    }

    // Soft delete: bloqueo temporal inmediato
    user.deletedAt = new Date();
    user.status    = 'inactive';
    await user.save();

    auditLog({
      userId,
      role:       req.user.role,
      action:     'ARCO_CANCEL',
      resource:   'users',
      resourceId: userId,
      ip:         req.ip,
      result:     'SUCCESS',
      detail:     'El usuario ejerció su derecho de Cancelación. Datos bloqueados. Anonimización en 30 días.',
    });

    return res.status(200).json({
      success: true,
      message: 'Solicitud de cancelación procesada. Tu cuenta ha sido bloqueada temporalmente. Tus datos personales serán eliminados de forma permanente en 30 días.',
      deletedAt:         user.deletedAt,
      permanentDeleteAt: new Date(user.deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000),
    });

  } catch (error) {
    logger.error('ARCO_CANCEL_ERROR', { error: error.message, userId: req.user?.id });
    return res.status(500).json({ success: false, message: 'Error al procesar solicitud de cancelación' });
  }
};

/**
 * OPOSICIÓN – El usuario se opone al tratamiento de sus datos para finalidades secundarias.
 * Actualiza el campo `dataConsent` en su perfil.
 * @route PATCH /api/arco/oposicion
 * @body { "opposeTo": "marketing" | "analytics" | "thirdParty" }
 */
exports.solicitarOposicion = async (req, res) => {
  try {
    const userId   = req.user.id;
    const { opposeTo } = req.body;

    const validPurposes = ['marketing', 'analytics', 'thirdParty'];
    if (!opposeTo || !validPurposes.includes(opposeTo)) {
      return res.status(400).json({
        success: false,
        message: `El campo 'opposeTo' debe ser uno de: ${validPurposes.join(', ')}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Registrar la oposición en el modelo (campo dinámico en dataConsent)
    if (!user.dataConsent) user.dataConsent = {};
    user.dataConsent[opposeTo] = false;
    user.markModified('dataConsent');
    await user.save();

    auditLog({
      userId,
      role:       req.user.role,
      action:     'ARCO_OPPOSITION',
      resource:   'users',
      resourceId: userId,
      ip:         req.ip,
      result:     'SUCCESS',
      detail:     `El usuario ejerció su derecho de Oposición para: ${opposeTo}`,
    });

    return res.status(200).json({
      success: true,
      message: `Tu oposición al tratamiento de datos para "${opposeTo}" ha sido registrada correctamente.`,
      dataConsent: user.dataConsent,
    });

  } catch (error) {
    logger.error('ARCO_OPPOSITION_ERROR', { error: error.message, userId: req.user?.id });
    return res.status(500).json({ success: false, message: 'Error al procesar solicitud de oposición' });
  }
};
