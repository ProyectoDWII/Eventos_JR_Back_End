/**
 * Validadores genéricos reutilizables
 */

/**
 * Valida que un email tenga formato correcto
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que un número de teléfono sea válido (México: 10 dígitos)
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Valida que una fecha sea futura
 */
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Valida que un precio sea positivo
 */
const isPositiveNumber = (value) => {
  return typeof value === 'number' && value >= 0;
};

/**
 * Valida que una cadena no esté vacía
 */
const isNotEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isFutureDate,
  isPositiveNumber,
  isNotEmpty,
};
