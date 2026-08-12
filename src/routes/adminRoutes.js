const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const userRepository = require('../repositories/userRepository');
const applicationRepository = require('../repositories/applicationRepository');
const contractRepository = require('../repositories/contractRepository');
const { updateApplicationStatusSchema, createContractSchema } = require('../validators/requestValidators');
const { validate } = require('../middleware/validationMiddleware');
const { successResponse, errorResponse } = require('../utils/formatters');
const { generateContractPDF } = require('../service/pdfService');

// Todas las rutas admin requieren autenticación y rol 'admin'
router.use(protect, restrictTo('admin'));

/**
 * GET /api/admin/users
 * Obtener todos los usuarios
 */
router.get('/users', async (req, res, next) => {
  try {
    const users = await userRepository.findAllActive();
    return successResponse(res, users, 'Usuarios obtenidos');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/users/:id
 * Obtener un usuario por ID
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) return errorResponse(res, 'Usuario no encontrado', 404);
    return successResponse(res, user, 'Usuario obtenido');
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/users/:id
 * Desactivar usuario
 */
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await userRepository.deactivate(req.params.id);
    if (!user) return errorResponse(res, 'Usuario no encontrado', 404);
    return successResponse(res, null, 'Usuario desactivado');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/applications
 * Ver todas las solicitudes
 */
router.get('/applications', async (req, res, next) => {
  try {
    const { status } = req.query;
    const applications = status
      ? await applicationRepository.findByStatus(status)
      : await applicationRepository.findAllPopulated();
    return successResponse(res, applications, 'Solicitudes obtenidas');
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/applications/:id/status
 * Actualizar estado de una solicitud
 */
router.put('/applications/:id/status', validate(updateApplicationStatusSchema), async (req, res, next) => {
  try {
    const application = await applicationRepository.updateById(req.params.id, req.body);
    if (!application) return errorResponse(res, 'Solicitud no encontrada', 404);
    return successResponse(res, application, 'Estado actualizado');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/contracts
 * Ver todos los contratos
 */
router.get('/contracts', async (req, res, next) => {
  try {
    const { status } = req.query;
    const contracts = status
      ? await contractRepository.findByStatus(status)
      : await contractRepository.findAll({}, { populate: ['client', 'package'] });
    return successResponse(res, contracts, 'Contratos obtenidos');
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/contracts
 * Crear un contrato
 */
router.post('/contracts', validate(createContractSchema), async (req, res, next) => {
  try {
    const contract = await contractRepository.create(req.body);
    return successResponse(res, contract, 'Contrato creado', 201);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/contracts/:id/pdf
 * Generar PDF del contrato
 */
router.get('/contracts/:id/pdf', async (req, res, next) => {
  try {
    const contract = await contractRepository.findByIdPopulated(req.params.id);
    if (!contract) return errorResponse(res, 'Contrato no encontrado', 404);

    const pdfPath = await generateContractPDF(contract);
    await contractRepository.updateById(contract._id, { pdfUrl: pdfPath });

    return successResponse(res, { pdfUrl: pdfPath }, 'PDF generado correctamente');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/dashboard
 * Resumen general (dashboard)
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const [totalUsers, totalContracts, pendingApplications, upcomingContracts] = await Promise.all([
      userRepository.count({ active: true }),
      contractRepository.count(),
      applicationRepository.count({ status: 'pendiente' }),
      contractRepository.findUpcoming(7),
    ]);

    return successResponse(
      res,
      {
        totalUsers,
        totalContracts,
        pendingApplications,
        upcomingEvents: upcomingContracts.length,
        upcomingContracts,
      },
      'Dashboard obtenido'
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
