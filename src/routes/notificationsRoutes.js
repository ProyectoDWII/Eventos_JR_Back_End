const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllNews, getNewsById } = require('../service/newsService');
const { successResponse, errorResponse } = require('../utils/formatters');

/**
 * GET /api/notifications/news
 * Obtener noticias/novedades (todos los usuarios autenticados)
 */
router.get('/news', protect, async (req, res, next) => {
  try {
    const news = getAllNews();
    return successResponse(res, news, 'Noticias obtenidas');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/news/:id
 * Obtener noticia por ID
 */
router.get('/news/:id', protect, async (req, res, next) => {
  try {
    const news = getNewsById(req.params.id);
    if (!news) return errorResponse(res, 'Noticia no encontrada', 404);
    return successResponse(res, news, 'Noticia obtenida');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/upcoming
 * Obtener eventos próximos (solo admin)
 */
router.get('/upcoming', protect, async (req, res, next) => {
  try {
    const contractRepository = require('../repositories/contractRepository');
    const upcoming = await contractRepository.findUpcoming(7);
    return successResponse(res, upcoming, 'Eventos próximos obtenidos');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
