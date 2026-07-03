const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const userController = require('../controller/userController'); // ← SIN "s"
const { body, param } = require('express-validator');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

//! CRUD de Usuarios
router.get('/users', userController.getAllUsers);

router.get('/users/:id', [param('id').isMongoId().withMessage('ID de usuario inválido')], userController.getUserById);

router.put(
  '/users/:id',
  [
    param('id').isMongoId().withMessage('ID de usuario inválido'),
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('phoneNumber').optional().isString(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Estado inválido')
  ],
  userController.updateUser
);

router.patch(
  '/users/:id/rol',
  [
    param('id').isMongoId().withMessage('ID de usuario inválido'),
    body('role').isIn(['admin', 'client']).withMessage('Rol debe ser admin o client')
  ],
  userController.changeUserRole
);

router.delete(
  '/users/:id',
  [
    param('id').isMongoId().withMessage('ID de usuario inválido')
  ],
  userController.deleteUser
);

router.patch(
  '/users/:id/restore',
  [
    param('id').isMongoId().withMessage('ID de usuario inválido')
  ],
  userController.restoreUser
);

module.exports = router; 