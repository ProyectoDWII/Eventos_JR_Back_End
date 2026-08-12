const { Server } = require('socket.io');
const { registerSocketEvents } = require('./events');
const logger = require('../utils/logger');

/**
 * Inicializa Socket.io sobre el servidor HTTP
 * @param {http.Server} httpServer - El servidor HTTP de Node.js
 * @returns {Server} instancia de Socket.io
 */
const initializeSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  logger.info('🔌 Socket.io inicializado');
  registerSocketEvents(io);

  return io;
};

module.exports = { initializeSockets };
