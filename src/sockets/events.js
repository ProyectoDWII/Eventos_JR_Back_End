const { processMessage } = require('../service/chatbotService');
const logger = require('../utils/logger');

/**
 * Eventos de Socket.io para el chat en tiempo real
 */
const registerSocketEvents = (io) => {
  io.on('connection', (socket) => {
    logger.info(`🔌 Cliente conectado: ${socket.id}`);

    // Unirse a una sala privada (por ID de usuario)
    socket.on('join_room', (userId) => {
      socket.join(`user_${userId}`);
      logger.info(`👤 Usuario ${userId} se unió a su sala`);
    });

    // Manejar mensaje de chat al chatbot
    socket.on('chat_message', (data) => {
      const { message, userId } = data;
      const botResponse = processMessage(message);

      // Emitir respuesta al mismo cliente
      socket.emit('bot_response', {
        message: botResponse,
        timestamp: new Date(),
      });

      logger.info(`💬 Mensaje de ${userId}: "${message}" → Bot: "${botResponse}"`);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      logger.info(`❌ Cliente desconectado: ${socket.id}`);
    });

    // Mensaje de bienvenida al conectarse
    socket.emit('connected', {
      message: '¡Conectado al chat de Eventos JR! ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    });
  });
};

module.exports = { registerSocketEvents };
