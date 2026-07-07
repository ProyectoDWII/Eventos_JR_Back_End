require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/database');
const { scheduleAnonymizationJob } = require('./jobs/anonymizationJob');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

logger.info('SERVER_START', {
  port:       process.env.PORT || '3000 (default)',
  mongodb:    process.env.MONGODB_URI ? 'Definido' : 'NO DEFINIDO',
  jwtSecret:  process.env.JWT_SECRET ? 'Definido' : 'NO DEFINIDO',
  jwtExpires: process.env.JWT_EXPIRES_IN || '7d (default)',
  nodeEnv:    process.env.NODE_ENV || 'development',
});

// Conectar a la base de datos
connectDB();

// Iniciar jobs automáticos
scheduleAnonymizationJob();

app.listen(PORT, () => {
  logger.info('SERVER_READY', { message: `Servidor corriendo en http://localhost:${PORT}` });
});