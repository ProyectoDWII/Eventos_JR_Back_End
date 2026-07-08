const BaseRepository = require('./baseRepository');
const PaqueteModel = require('../models/package');

class PaqueteRepository extends BaseRepository {
  constructor() {
    super(PaqueteModel);
  }

  async findByIdWithServices(id) {
    return await this.findById(id, 'services');
  }

  async findActivePackages() {
    return await this.find({ status: 'active' }, 'services', { sort: { price: 1 } });
  }

  async findWithServices(filter = {}) {
    return await this.find(filter, 'services');
  }
}

module.exports = PaqueteRepository;
