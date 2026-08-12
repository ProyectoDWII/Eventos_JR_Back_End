const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const applicationRepository = require('../repositories/applicationRepository');
const { successResponse, errorResponse } = require('../utils/formatters');

/**
 * GET /api/applications
 * Obtener solicitudes (admin: todas, client: las propias)
 */
router.get('/', protect, async (req, res, next) => {
  try {
    let applications;
    if (req.user.role === 'admin') {
      applications = await applicationRepository.findAllPopulated();
    } else {
      applications = await applicationRepository.findByClient(req.user._id);
    }
    return successResponse(res, applications, 'Solicitudes obtenidas');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/applications/:id
 * Obtener una solicitud por ID
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const application = await applicationRepository.findById(req.params.id, {
      populate: ['client', 'package', 'services'],
    });
    if (!application) return errorResponse(res, 'Solicitud no encontrada', 404);

    // Solo el dueño o admin puede ver la solicitud
    if (
      req.user.role !== 'admin' &&
      application.client._id.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 'No tienes acceso a esta solicitud', 403);
    }

    return successResponse(res, application, 'Solicitud obtenida');
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/applications/:id
 * Cancelar/eliminar una solicitud (solo admin)
 */
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const application = await applicationRepository.deleteById(req.params.id);
    if (!application) return errorResponse(res, 'Solicitud no encontrada', 404);
    return successResponse(res, null, 'Solicitud eliminada');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
