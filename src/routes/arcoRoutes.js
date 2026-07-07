/**
 * @file arcoRoutes.js
 * @description Rutas para el ejercicio de derechos ARCO del usuario autenticado.
 * Todos los endpoints requieren autenticación con JWT.
 * Se aplica rate limiting estricto (arcoLimiter) para prevenir abuso.
 */

const express = require('express');
const router  = express.Router();

const authMiddleware            = require('../middleware/authMiddleware');
const { arcoLimiter }           = require('../middleware/rateLimiter');
const { solicitarAcceso, solicitarCancelacion, solicitarOposicion } = require('../controller/arcoController');

// Todos los endpoints ARCO requieren autenticación
router.use(authMiddleware);

// Aplicar rate limiter estricto a todas las rutas ARCO
router.use(arcoLimiter);

/**
 * @route  GET /api/arco/acceso
 * @desc   Derecho de Acceso: el usuario obtiene todos sus datos personales almacenados.
 * @access Privado (usuario autenticado)
 */
router.get('/acceso', solicitarAcceso);

/**
 * @route  DELETE /api/arco/cancelacion
 * @desc   Derecho de Cancelación: el usuario solicita la eliminación de su cuenta.
 *         Soft delete inmediato + anonimización permanente en 30 días.
 * @access Privado (usuario autenticado)
 */
router.delete('/cancelacion', solicitarCancelacion);

/**
 * @route  PATCH /api/arco/oposicion
 * @desc   Derecho de Oposición: el usuario se opone a cierto tratamiento de datos.
 * @body   { "opposeTo": "marketing" | "analytics" | "thirdParty" }
 * @access Privado (usuario autenticado)
 */
router.patch('/oposicion', solicitarOposicion);

module.exports = router;
