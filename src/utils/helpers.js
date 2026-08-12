/**
 * Funciones auxiliares generales del proyecto
 */

/**
 * Genera una contraseña aleatoria simple
 */
const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Calcula el precio total de un paquete + servicios adicionales
 */
const calculateTotal = (packagePrice = 0, servicesArray = []) => {
  const servicesTotal = servicesArray.reduce((acc, s) => acc + (s.price || 0), 0);
  return packagePrice + servicesTotal;
};

/**
 * Convierte texto a slug (para URLs amigables)
 */
const toSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

/**
 * Verifica si un ID de Mongoose es válido
 */
const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

/**
 * Paginar resultados de un array
 */
const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    totalPages: Math.ceil(array.length / limit),
  };
};

module.exports = {
  generateRandomPassword,
  calculateTotal,
  toSlug,
  isValidObjectId,
  paginate,
};
