/**
 * Servicio de chatbot simple basado en palabras clave
 * Responde preguntas frecuentes de los clientes
 */

const responses = {
  precios: '💰 Nuestros paquetes inician desde $5,000 MXN. Puedes ver todos nuestros paquetes en la sección de Paquetes.',
  paquetes: '📦 Contamos con paquetes para bodas, quinceañeras, graduaciones y más. Visita la sección de Paquetes para ver los detalles.',
  contacto: '📞 Puedes contactarnos al teléfono (555) 123-4567 o por correo a contacto@eventosjr.com',
  disponibilidad: '📅 Para verificar disponibilidad, por favor envía una solicitud con la fecha de tu evento y te responderemos a la brevedad.',
  pago: '💳 Aceptamos pagos en efectivo, transferencia bancaria y tarjeta de crédito/débito. Se requiere un anticipo del 30% para confirmar.',
  entrega: '📸 Las fotografías se entregan en un plazo de 2 a 4 semanas después del evento en formato digital de alta resolución.',
  gracias: '😊 ¡Con gusto! Si tienes más preguntas, estoy aquí para ayudarte.',
  hola: '👋 ¡Hola! Soy el asistente virtual de Eventos JR. ¿En qué puedo ayudarte?',
  default: '🤖 No entiendo tu pregunta. Por favor contáctanos directamente al (555) 123-4567 o escríbenos a contacto@eventosjr.com',
};

const keywords = {
  precios: ['precio', 'costo', 'cuánto', 'cuanto', 'tarifa', 'cobran', 'vale'],
  paquetes: ['paquete', 'servicios', 'ofrecen', 'incluye', 'qué hacen'],
  contacto: ['contacto', 'teléfono', 'telefono', 'correo', 'email', 'llamar', 'hablar'],
  disponibilidad: ['disponible', 'disponibilidad', 'libre', 'fecha', 'agenda'],
  pago: ['pago', 'pagar', 'anticipo', 'depósito', 'deposito', 'transferencia', 'efectivo'],
  entrega: ['entrega', 'tiempo', 'cuándo', 'cuando', 'días', 'dias', 'fotos', 'fotografías'],
  gracias: ['gracias', 'thanks', 'ok', 'perfecto', 'excelente'],
  hola: ['hola', 'buenos', 'buenas', 'saludos', 'hey'],
};

/**
 * Procesa el mensaje del usuario y devuelve una respuesta
 */
const processMessage = (message) => {
  const lowerMsg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => lowerMsg.includes(word))) {
      return responses[category];
    }
  }

  return responses.default;
};

module.exports = { processMessage };
