const BaseRepository = require('./baseRepository');
const Package = require('../models/package');

class PackageRepository extends BaseRepository {
  constructor() {
    super(Package);
  }

  /**
   * Obtener paquetes activos con sus servicios populados
   */
  async findAllActive() {
    return await this.findAll({ active: true }, { populate: 'services' });
  }

  /**
   * Obtener un paquete por ID con servicios populados
   */
  async findByIdWithServices(id) {
    return await this.findById(id, { populate: 'services' });
  }

  /**
   * Desactivar un paquete
   */
  async deactivate(id) {
    return await this.updateById(id, { active: false });
  }
}

module.exports = new PackageRepository();
