const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const { generateToken } = require('../service/tokenService');

const router = express.Router();

//! Registro 
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name, role } = req.body;

      console.log('📝 ===== REGISTRO =====');
      console.log('📧 Email:', email);
      console.log('👤 Name:', name);
      console.log('🎭 Role:', role || 'client');

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ Email ya registrado');
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      const newUser = await User.create({
        email,
        password, 
        name,
        role: role || 'client',
        status: 'active',
      });

      console.log('✅ Usuario creado con ID:', newUser._id);
      console.log('📧 Email guardado:', newUser.email);
      console.log('========================');

      const token = generateToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error('❌ Error en registro:', error);
      res.status(500).json({ 
        message: 'Error en el servidor',
        error: error.message 
      });
    }
  }
);

//! Login 
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Cuenta desactivada' });
      }

      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        message: 'Login exitoso',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('❌ Error en login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
);

module.exports = router;