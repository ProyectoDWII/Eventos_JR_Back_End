const BaseRepository = require('./baseRepository');
const ServicioModel = require('../models/service');

class ServicioRepository extends BaseRepository {
  constructor() {
    super(ServicioModel);
  }

  async findByCategory(category) {
    if (!category) return [];
    return await this.find({ category, status: 'active' }, '', { sort: { price: 1 } });
  }

  async findActiveServices() {
    return await this.find({ status: 'active' }, '', { sort: { name: 1 } });
  }
}

module.exports = ServicioRepository;
