/**
 * @file solicitudRepository.js
 * @description Repositorio específico para la entidad de Solicitud de Evento (SolicitudModel).
 */

const BaseRepository = require('./baseRepository');
const SolicitudModel = require('../models/aplication');

class SolicitudRepository extends BaseRepository {
  constructor() {
    super(SolicitudModel);
  }

  /**
   * Obtiene una solicitud por su ID, poblando los detalles de cliente, paquete y servicios.
   * @param {string} id - ID de la solicitud.
   * @returns {Promise<import('mongoose').Document|null>} La solicitud poblada o null.
   */
  async findByIdWithDetails(id) {
    return await this.findById(id, 'client package services');
  }

  /**
   * Obtiene solicitudes que coincidan con un filtro, poblando sus relaciones.
   * @param {Object} [filter] - Filtros de búsqueda.
   * @param {Object} [options] - Opciones de paginación/ordenamiento.
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de solicitudes pobladas.
   */
  async findWithDetails(filter = {}, options = {}) {
    return await this.find(filter, 'client package services', options);
  }

  /**
   * Obtiene todas las solicitudes realizadas por un cliente específico.
   * @param {string} clientId - ID del cliente (User).
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de solicitudes del cliente.
   */
  async findByClientId(clientId) {
    return await this.find({ client: clientId }, 'package services', { sort: { createdAt: -1 } });
  }

  /**
   * Actualiza el estado de una solicitud.
   * @param {string} id - ID de la solicitud.
   * @param {string} status - Nuevo estado ('pending', 'approved', 'rejected', 'cancelled').
   * @returns {Promise<import('mongoose').Document|null>} La solicitud actualizada o null.
   */
  async updateStatus(id, status) {
    return await this.update(id, { status });
  }
}

module.exports = SolicitudRepository;
