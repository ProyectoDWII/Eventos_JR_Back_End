const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/userRepository');
const { createTokenResponse } = require('../service/tokenService');
const { registerSchema, loginSchema } = require('../validators/userValidation');
const { validate } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/authMiddleware');
const { successResponse, errorResponse } = require('../utils/formatters');

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'Ya existe una cuenta con ese correo.', 409);
    }

    const user = await userRepository.create({ name, email, password, phone, role });
    return createTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findByEmailWithPassword(email);
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Correo o contraseña incorrectos.', 401);
    }

    if (!user.active) {
      return errorResponse(res, 'Tu cuenta está desactivada.', 401);
    }

    return createTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Obtener perfil del usuario autenticado
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    return successResponse(res, req.user, 'Perfil obtenido correctamente');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
