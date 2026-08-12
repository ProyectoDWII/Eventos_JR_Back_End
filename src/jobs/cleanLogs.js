const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Job: Limpiar logs antiguos (más de 30 días)
 * Se ejecuta cada domingo a las 2:00 AM
 */
const startCleanLogs = () => {
  cron.schedule('0 2 * * 0', () => {
    logger.info('🧹 Ejecutando limpieza de logs antiguos...');

    const logsDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logsDir)) {
      logger.info('📁 Directorio de logs no encontrado, omitiendo limpieza.');
      return;
    }

    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    files.forEach((file) => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtimeMs;

      if (fileAge > THIRTY_DAYS_MS) {
        fs.unlinkSync(filePath);
        deletedCount++;
        logger.info(`🗑️  Archivo eliminado: ${file}`);
      }
    });

    logger.info(`✅ Limpieza completada. ${deletedCount} archivos eliminados.`);
  });

  logger.info('⏰ Job de limpieza de logs programado (domingo 2:00 AM)');
};

module.exports = { startCleanLogs };
