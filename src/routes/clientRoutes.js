const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { updateUserSchema } = require('../validators/userValidation');
const userRepository = require('../repositories/userRepository');
const applicationRepository = require('../repositories/applicationRepository');
const contractRepository = require('../repositories/contractRepository');
const packageRepository = require('../repositories/packageRepository');
const serviceRepository = require('../repositories/serviceRepository');
const { createApplicationSchema } = require('../validators/requestValidators');
const { successResponse, errorResponse } = require('../utils/formatters');

// Todas las rutas de clientes requieren autenticación y rol 'client'
router.use(protect, restrictTo('client'));

/**
 * GET /api/client/profile
 * Ver perfil propio
 */
router.get('/profile', async (req, res, next) => {
  try {
    return successResponse(res, req.user, 'Perfil obtenido');
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/client/profile
 * Actualizar perfil
 */
router.put('/profile', validate(updateUserSchema), async (req, res, next) => {
  try {
    const updated = await userRepository.updateById(req.user._id, req.body);
    return successResponse(res, updated, 'Perfil actualizado');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/packages
 * Ver paquetes disponibles
 */
router.get('/packages', async (req, res, next) => {
  try {
    const packages = await packageRepository.findAllActive();
    return successResponse(res, packages, 'Paquetes obtenidos');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/services
 * Ver servicios disponibles
 */
router.get('/services', async (req, res, next) => {
  try {
    const services = await serviceRepository.findAllActive();
    return successResponse(res, services, 'Servicios obtenidos');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/applications
 * Ver mis solicitudes
 */
router.get('/applications', async (req, res, next) => {
  try {
    const applications = await applicationRepository.findByClient(req.user._id);
    return successResponse(res, applications, 'Solicitudes obtenidas');
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/client/applications
 * Crear una nueva solicitud
 */
router.post('/applications', validate(createApplicationSchema), async (req, res, next) => {
  try {
    const application = await applicationRepository.create({
      ...req.body,
      client: req.user._id,
    });
    return successResponse(res, application, 'Solicitud enviada correctamente', 201);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/contracts
 * Ver mis contratos
 */
router.get('/contracts', async (req, res, next) => {
  try {
    const contracts = await contractRepository.findByClient(req.user._id);
    return successResponse(res, contracts, 'Contratos obtenidos');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
