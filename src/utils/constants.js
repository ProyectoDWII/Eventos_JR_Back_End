/**
 * Constantes globales del proyecto Eventos JR
 */

const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

const CONTRACT_STATUS = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
};

const APPLICATION_STATUS = {
  PENDIENTE: 'pendiente',
  REVISANDO: 'revisando',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
};

const EVENT_TYPES = [
  'boda',
  'quinceañera',
  'cumpleaños',
  'corporativo',
  'graduacion',
  'otro',
];

const SERVICE_CATEGORIES = [
  'fotografia',
  'video',
  'album',
  'edicion',
  'otro',
];

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  ROLES,
  CONTRACT_STATUS,
  APPLICATION_STATUS,
  EVENT_TYPES,
  SERVICE_CATEGORIES,
  HTTP_STATUS,
};
