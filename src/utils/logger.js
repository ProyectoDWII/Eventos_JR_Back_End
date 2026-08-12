const winston = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato personalizado de log
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Consola en desarrollo
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat),
    }),
    // Archivo de errores
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    // Archivo de todos los logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
  ],
});

module.exports = logger;
