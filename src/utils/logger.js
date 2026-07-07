/**
 * @file logger.js
 * @description Logger de auditoría centralizado usando Winston.
 * IMPORTANTE: Este logger NO debe escribir datos personales (emails, nombres,
 * contraseñas, teléfonos) directamente en los logs para evitar fugas de información.
 * Solo registra IDs de usuario, roles, endpoints y acciones.
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio de logs exista
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Formato personalizado para los logs de auditoría
const auditFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json()
);

// Formato legible para consola en desarrollo
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message} ${metaStr}`;
  })
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: auditFormat,
  transports: [
    // Log general de la aplicación
    new transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      tailable: true,
    }),
    // Log exclusivo de auditoría (accesos y modificaciones a datos)
    new transports.File({
      filename: path.join(logsDir, 'audit.log'),
      level: 'info',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true,
    }),
    // Log de errores
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
  ],
});

// En desarrollo también mostrar en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: consoleFormat }));
}

/**
 * Registra un evento de auditoría de acceso a datos personales.
 * NO incluir datos personales en los parámetros.
 * @param {Object} params
 * @param {string} params.userId   - ID del usuario que realizó la acción
 * @param {string} params.role     - Rol del usuario (admin, client)
 * @param {string} params.action   - Acción realizada (READ, UPDATE, DELETE, ARCO_REQUEST, etc.)
 * @param {string} params.resource - Recurso afectado (users, contracts, etc.)
 * @param {string} params.resourceId - ID del recurso afectado (nunca datos personales)
 * @param {string} params.ip       - IP de origen de la petición
 * @param {string} [params.result] - Resultado de la operación (SUCCESS, DENIED, ERROR)
 * @param {string} [params.detail] - Detalle adicional sin datos personales
 */
const auditLog = ({ userId, role, action, resource, resourceId, ip, result = 'SUCCESS', detail = '' }) => {
  logger.info('AUDIT_EVENT', {
    type: 'AUDIT',
    userId: userId || 'ANONYMOUS',
    role: role || 'UNKNOWN',
    action,
    resource,
    resourceId: resourceId || 'N/A',
    ip: ip || 'UNKNOWN',
    result,
    detail,
  });
};

module.exports = { logger, auditLog };
