const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createPackageSchema, updatePackageSchema } = require('../validators/packageValidators');
const packageRepository = require('../repositories/packageRepository');
const { successResponse, errorResponse } = require('../utils/formatters');

/**
 * GET /api/packages
 * Obtener todos los paquetes activos (público)
 */
router.get('/', async (req, res, next) => {
  try {
    const packages = await packageRepository.findAllActive();
    return successResponse(res, packages, 'Paquetes obtenidos');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/packages/:id
 * Obtener un paquete por ID (público)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const pkg = await packageRepository.findByIdWithServices(req.params.id);
    if (!pkg) return errorResponse(res, 'Paquete no encontrado', 404);
    return successResponse(res, pkg, 'Paquete obtenido');
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/packages
 * Crear un paquete (solo admin)
 */
router.post('/', protect, restrictTo('admin'), validate(createPackageSchema), async (req, res, next) => {
  try {
    const pkg = await packageRepository.create(req.body);
    return successResponse(res, pkg, 'Paquete creado', 201);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/packages/:id
 * Actualizar un paquete (solo admin)
 */
router.put('/:id', protect, restrictTo('admin'), validate(updatePackageSchema), async (req, res, next) => {
  try {
    const pkg = await packageRepository.updateById(req.params.id, req.body);
    if (!pkg) return errorResponse(res, 'Paquete no encontrado', 404);
    return successResponse(res, pkg, 'Paquete actualizado');
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/packages/:id
 * Desactivar un paquete (solo admin)
 */
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const pkg = await packageRepository.deactivate(req.params.id);
    if (!pkg) return errorResponse(res, 'Paquete no encontrado', 404);
    return successResponse(res, null, 'Paquete desactivado');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
