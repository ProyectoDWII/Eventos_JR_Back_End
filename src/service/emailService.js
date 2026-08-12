const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Crea el transporter de nodemailer con la configuración del .env
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true para 465, false para otros
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Envía un correo electrónico genérico
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Eventos JR" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email enviado a ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error al enviar email a ${to}: ${error.message}`);
    throw error;
  }
};

/**
 * Envía correo de bienvenida al registrarse
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2c3e50;">¡Bienvenido a Eventos JR! 🎉</h2>
      <p>Hola <strong>${user.name}</strong>,</p>
      <p>Tu cuenta ha sido creada exitosamente. Ya puedes explorar nuestros paquetes y servicios fotográficos.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <br>
      <p>El equipo de <strong>Eventos JR</strong></p>
    </div>
  `;
  return await sendEmail({
    to: user.email,
    subject: '¡Bienvenido a Eventos JR!',
    html,
  });
};

/**
 * Envía confirmación de solicitud
 */
const sendApplicationConfirmation = async (user, application) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2c3e50;">Solicitud Recibida ✅</h2>
      <p>Hola <strong>${user.name}</strong>,</p>
      <p>Hemos recibido tu solicitud para el evento de tipo <strong>${application.eventType}</strong>.</p>
      <p>Nuestro equipo la revisará y te contactará pronto.</p>
      <br>
      <p>El equipo de <strong>Eventos JR</strong></p>
    </div>
  `;
  return await sendEmail({
    to: user.email,
    subject: 'Solicitud recibida - Eventos JR',
    html,
  });
};

/**
 * Envía recordatorio de evento próximo
 */
const sendEventReminder = async (user, contract) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #e74c3c;">Recordatorio de Evento 📅</h2>
      <p>Hola <strong>${user.name}</strong>,</p>
      <p>Te recordamos que tu evento <strong>${contract.eventType}</strong> está programado para el 
      <strong>${new Date(contract.eventDate).toLocaleDateString('es-MX')}</strong>.</p>
      <p>Ubicación: <strong>${contract.eventLocation}</strong></p>
      <br>
      <p>El equipo de <strong>Eventos JR</strong></p>
    </div>
  `;
  return await sendEmail({
    to: user.email,
    subject: 'Recordatorio de tu evento - Eventos JR',
    html,
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendApplicationConfirmation, sendEventReminder };
