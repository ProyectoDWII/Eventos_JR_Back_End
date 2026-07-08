const BaseRepository = require('./baseRepository');
const SolicitudModel = require('../models/aplication');

class SolicitudRepository extends BaseRepository {
  constructor() {
    super(SolicitudModel);
  }

  async findByIdWithDetails(id) {
    return await this.findById(id, 'client package services');
  }

  async findWithDetails(filter = {}, options = {}) {
    return await this.find(filter, 'client package services', options);
  }

  async findByClientId(clientId) {
    return await this.find({ client: clientId }, 'package services', { sort: { createdAt: -1 } });
  }

  async updateStatus(id, status) {
    return await this.update(id, { status });
  }
}

module.exports = SolicitudRepository;
