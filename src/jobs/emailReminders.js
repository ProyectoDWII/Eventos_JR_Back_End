const cron = require('node-cron');
const contractRepository = require('../repositories/contractRepository');
const { sendEventReminder } = require('../service/emailService');
const logger = require('../utils/logger');

/**
 * Job: Enviar recordatorios de eventos próximos
 * Se ejecuta todos los días a las 8:00 AM
 */
const startEmailReminders = () => {
  cron.schedule('0 8 * * *', async () => {
    logger.info('📧 Ejecutando job de recordatorios de email...');

    try {
      // Obtener contratos en los próximos 3 días
      const upcomingContracts = await contractRepository.findUpcoming(3);

      for (const contract of upcomingContracts) {
        if (contract.client && contract.client.email) {
          await sendEventReminder(contract.client, contract);
          logger.info(`✉️  Recordatorio enviado a ${contract.client.email}`);
        }
      }

      logger.info(`✅ Job de recordatorios completado. ${upcomingContracts.length} emails enviados.`);
    } catch (error) {
      logger.error(`❌ Error en job de recordatorios: ${error.message}`);
    }
  });

  logger.info('⏰ Job de recordatorios de email programado (diario 8:00 AM)');
};

module.exports = { startEmailReminders };
