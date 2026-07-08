const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Ruta de cliente accedida por:', req.user?.email);
  next();
});

router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard del cliente',
    user: req.user
  });
});

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Perfil del cliente',
    user: req.user
  });
});

module.exports = router;