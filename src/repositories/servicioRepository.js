
/**
 * @file servicioRepository.js
 * @description Repositorio específico para la entidad de Servicio (ServicioModel).
 */

const BaseRepository = require('./baseRepository');
const ServicioModel = require('../models/service');

class ServicioRepository extends BaseRepository {
  constructor() {
    super(ServicioModel);
  }

  /**
   * Obtiene servicios por categoría.
   * @param {string} category - Categoría del servicio ('photography', 'catering', etc.)
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de servicios en esa categoría.
   */
  async findByCategory(category) {
    if (!category) return [];
    return await this.find({ category, status: 'active' }, '', { sort: { price: 1 } });
  }

  /**
   * Obtiene todos los servicios activos.
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de servicios activos.
   */
  async findActiveServices() {
    return await this.find({ status: 'active' }, '', { sort: { name: 1 } });
  }
}

module.exports = ServicioRepository;
