const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processMessage } = require('../service/chatbotService');
const { successResponse } = require('../utils/formatters');

/**
 * POST /api/chat/message
 * Enviar mensaje al chatbot y recibir respuesta
 */
router.post('/message', protect, async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'El mensaje no puede estar vacío' });
    }

    const response = processMessage(message);

    return successResponse(
      res,
      {
        userMessage: message,
        botResponse: response,
        timestamp: new Date(),
      },
      'Mensaje procesado'
    );
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/history
 * Placeholder para historial de chat (implementar con Socket.io)
 */
router.get('/history', protect, async (req, res) => {
  return successResponse(res, [], 'Historial de chat (implementar con Socket.io)');
});

module.exports = router;
