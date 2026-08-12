const BaseRepository = require('./baseRepository');
const Application = require('../models/Application');

class ApplicationRepository extends BaseRepository {
  constructor() {
    super(Application);
  }

  /**
   * Obtener solicitudes de un cliente
   */
  async findByClient(clientId) {
    return await this.findAll(
      { client: clientId },
      { populate: ['package', 'services'], sort: { createdAt: -1 } }
    );
  }

  /**
   * Obtener todas las solicitudes con datos del cliente
   */
  async findAllPopulated() {
    return await this.findAll(
      {},
      { populate: ['client', 'package', 'services'], sort: { createdAt: -1 } }
    );
  }

  /**
   * Obtener solicitudes por estado
   */
  async findByStatus(status) {
    return await this.findAll(
      { status },
      { populate: ['client', 'package'], sort: { createdAt: -1 } }
    );
  }

  /**
   * Obtener solicitudes pendientes
   */
  async findPending() {
    return await this.findByStatus('pendiente');
  }
}

module.exports = new ApplicationRepository();
