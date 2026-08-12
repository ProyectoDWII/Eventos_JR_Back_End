const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { successResponse, errorResponse } = require('../utils/formatters');

/**
 * GET /api/photographer/gallery
 * Ver portafolio de trabajos (público)
 */
router.get('/gallery', async (req, res, next) => {
  try {
    // Placeholder: En producción, cargar desde DB o sistema de archivos
    const gallery = [
      { id: 1, title: 'Boda María & Carlos', category: 'boda', imageUrl: '/uploads/sample1.jpg' },
      { id: 2, title: 'XV Años Sofía', category: 'quinceañera', imageUrl: '/uploads/sample2.jpg' },
      { id: 3, title: 'Graduación UTNG 2024', category: 'graduacion', imageUrl: '/uploads/sample3.jpg' },
    ];
    return successResponse(res, gallery, 'Galería obtenida');
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/photographer/upload
 * Subir imagen al portafolio (solo admin)
 */
router.post('/upload', protect, restrictTo('admin'), (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return errorResponse(res, err.message, 400);
    }
    if (!req.file) {
      return errorResponse(res, 'No se proporcionó ninguna imagen', 400);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    return successResponse(res, { imageUrl, filename: req.file.filename }, 'Imagen subida correctamente', 201);
  });
});

module.exports = router;
