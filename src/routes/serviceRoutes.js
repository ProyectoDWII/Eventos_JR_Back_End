const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createServiceSchema, updateServiceSchema } = require('../validators/serviceValidators');
const serviceRepository = require('../repositories/serviceRepository');
const { successResponse, errorResponse } = require('../utils/formatters');

/**
 * GET /api/services
 * Obtener todos los servicios activos (público)
 */
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const services = category
      ? await serviceRepository.findByCategory(category)
      : await serviceRepository.findAllActive();
    return successResponse(res, services, 'Servicios obtenidos');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/services/:id
 * Obtener un servicio por ID (público)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const service = await serviceRepository.findById(req.params.id);
    if (!service) return errorResponse(res, 'Servicio no encontrado', 404);
    return successResponse(res, service, 'Servicio obtenido');
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/services
 * Crear un servicio (solo admin)
 */
router.post('/', protect, restrictTo('admin'), validate(createServiceSchema), async (req, res, next) => {
  try {
    const service = await serviceRepository.create(req.body);
    return successResponse(res, service, 'Servicio creado', 201);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/services/:id
 * Actualizar un servicio (solo admin)
 */
router.put('/:id', protect, restrictTo('admin'), validate(updateServiceSchema), async (req, res, next) => {
  try {
    const service = await serviceRepository.updateById(req.params.id, req.body);
    if (!service) return errorResponse(res, 'Servicio no encontrado', 404);
    return successResponse(res, service, 'Servicio actualizado');
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/services/:id
 * Desactivar un servicio (solo admin)
 */
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const service = await serviceRepository.deactivate(req.params.id);
    if (!service) return errorResponse(res, 'Servicio no encontrado', 404);
    return successResponse(res, null, 'Servicio desactivado');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
