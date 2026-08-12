require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { initializeSockets } = require('./sockets');
const { startEmailReminders } = require('./jobs/emailReminders');
const { startCleanLogs } = require('./jobs/cleanLogs');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Crear servidor HTTP sobre Express
const httpServer = http.createServer(app);

// Inicializar Socket.io
initializeSockets(httpServer);

// Conectar a MongoDB y arrancar el servidor
const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    logger.info(`📋 Entorno: ${process.env.NODE_ENV || 'development'}`);

    // Iniciar jobs en segundo plano
    startEmailReminders();
    startCleanLogs();

    logger.info('✅ Todos los servicios iniciados correctamente');
  });
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise} — reason: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

startServer();
