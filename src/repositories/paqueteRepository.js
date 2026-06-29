/**
 * @file paqueteRepository.js
 * @description Repositorio específico para la entidad de Paquete (PaqueteModel).
 */

const BaseRepository = require('./baseRepository');
const PaqueteModel = require('../models/package');

class PaqueteRepository extends BaseRepository {
  constructor() {
    super(PaqueteModel);
  }

  /**
   * Obtiene un paquete por su ID, poblando sus servicios.
   * @param {string} id - ID del paquete.
   * @returns {Promise<import('mongoose').Document|null>} El paquete con servicios poblados.
   */
  async findByIdWithServices(id) {
    return await this.findById(id, 'services');
  }

  /**
   * Obtiene todos los paquetes activos, poblando los servicios de cada uno.
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de paquetes activos.
   */
  async findActivePackages() {
    return await this.find({ status: 'active' }, 'services', { sort: { price: 1 } });
  }

  /**
   * Busca paquetes según filtros, poblando los servicios asociados.
   * @param {Object} [filter] - Criterios de búsqueda.
   * @returns {Promise<Array<import('mongoose').Document>>}
   */
  async findWithServices(filter = {}) {
    return await this.find(filter, 'services');
  }
}

module.exports = PaqueteRepository;
