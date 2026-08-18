const BaseRepository = require('./baseRepository');
const Service = require('../models/service');

class ServiceRepository extends BaseRepository {
  constructor() {
    super(Service);
  }

  /**
   * Obtener servicios activos
   */
  async findAllActive() {
    return await this.findAll({ active: true });
  }

  /**
   * Obtener servicios por categoría
   */
  async findByCategory(category) {
    return await this.findAll({ category, active: true });
  }

  /**
   * Desactivar un servicio
   */
  async deactivate(id) {
    return await this.updateById(id, { active: false });
  }
}

module.exports = new ServiceRepository();
