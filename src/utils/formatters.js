/**
 * Formateadores de datos para respuestas de la API
 */

/**
 * Formatea la respuesta exitosa de la API
 */
const successResponse = (res, data, message = 'Éxito', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Formatea la respuesta de error de la API
 */
const errorResponse = (res, message = 'Error interno', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Formatea un precio en formato moneda mexicana
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

/**
 * Formatea una fecha a string legible en español
 */
const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Formatea fecha y hora
 */
const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

module.exports = {
  successResponse,
  errorResponse,
  formatCurrency,
  formatDate,
  formatDateTime,
};
