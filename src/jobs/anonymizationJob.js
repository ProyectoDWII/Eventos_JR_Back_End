/**
 * @file anonymizationJob.js
 * @description Job automático de ciclo de vida de datos.
 * Anonimiza permanentemente los datos personales de usuarios que llevan
 * más de 30 días en estado de eliminación (soft delete).
 * Esto cumple con el principio de minimización y ciclo de vida de datos.
 */

const cron = require('node-cron');
const User = require('../models/user');
const { logger, auditLog } = require('../utils/logger');

/**
 * Anonimiza permanentemente los datos personales de un usuario eliminado.
 * Reemplaza nombre, email y teléfono con valores anónimos que preservan
 * la integridad referencial de la base de datos (no se borra el documento).
 * @param {string} userId - ID del usuario a anonimizar
 */
const anonymizeUser = async (userId) => {
  const anonymizedEmail = `deleted_${userId}@anonimizado.local`;
  const anonymizedName  = '[USUARIO ELIMINADO]';
  const anonymizedPhone = null;

  await User.findByIdAndUpdate(
    userId,
    {
      name:        anonymizedName,
      email:       anonymizedEmail,
      phoneNumber: anonymizedPhone,
      status:      'inactive',
      // deletedAt se mantiene como registro de cuándo fue eliminado
    },
    { runValidators: false } // Saltamos validadores para email anonimizado
  );
};

/**
 * Ejecuta el proceso de anonimización.
 * Busca todos los usuarios con deletedAt mayor a 30 días y los anonimiza.
 */
const runAnonymizationJob = async () => {
  logger.info('ANONYMIZATION_JOB_START', { type: 'LIFECYCLE', message: 'Iniciando job de anonimización de datos' });

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Buscar usuarios eliminados hace más de 30 días que aún no han sido anonimizados
    const usersToAnonymize = await User.find({
      deletedAt:  { $lte: thirtyDaysAgo },
      email:      { $not: /^deleted_.*@anonimizado\.local$/ }, // Excluir ya anonimizados
    }).select('_id');

    if (usersToAnonymize.length === 0) {
      logger.info('ANONYMIZATION_JOB_SKIP', { type: 'LIFECYCLE', message: 'No hay usuarios que anonimizar en este ciclo' });
      return;
    }

    logger.info('ANONYMIZATION_JOB_FOUND', {
      type: 'LIFECYCLE',
      count: usersToAnonymize.length,
      message: `Se encontraron ${usersToAnonymize.length} usuario(s) para anonimizar`,
    });

    let successCount = 0;
    let errorCount   = 0;

    for (const user of usersToAnonymize) {
      try {
        await anonymizeUser(user._id);
        successCount++;

        auditLog({
          userId:     'SYSTEM_JOB',
          role:       'SYSTEM',
          action:     'ANONYMIZE',
          resource:   'users',
          resourceId: user._id.toString(),
          ip:         'INTERNAL',
          result:     'SUCCESS',
          detail:     'Anonimización automática por vencimiento de ciclo de vida (30 días)',
        });
      } catch (err) {
        errorCount++;
        logger.error('ANONYMIZATION_USER_ERROR', {
          type:       'LIFECYCLE',
          resourceId: user._id.toString(),
          error:      err.message,
        });
      }
    }

    logger.info('ANONYMIZATION_JOB_END', {
      type:         'LIFECYCLE',
      successCount,
      errorCount,
      message:      `Job finalizado: ${successCount} anonimizados, ${errorCount} errores`,
    });

  } catch (error) {
    logger.error('ANONYMIZATION_JOB_FATAL', {
      type:    'LIFECYCLE',
      error:   error.message,
      message: 'Error fatal en el job de anonimización',
    });
  }
};

/**
 * Registra y activa el cron job de anonimización.
 * Se ejecuta todos los días a las 2:00 AM.
 */
const scheduleAnonymizationJob = () => {
  // Ejecutar cada día a las 2:00 AM
  cron.schedule('0 2 * * *', runAnonymizationJob, {
    scheduled: true,
    timezone:  'America/Mexico_City',
  });

  logger.info('ANONYMIZATION_JOB_SCHEDULED', {
    type:     'LIFECYCLE',
    schedule: '0 2 * * * (cada día a las 2:00 AM)',
    message:  'Job de anonimización de datos programado correctamente',
  });
};

module.exports = { scheduleAnonymizationJob, runAnonymizationJob };
