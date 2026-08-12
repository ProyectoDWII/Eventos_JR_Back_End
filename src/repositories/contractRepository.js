const BaseRepository = require('./baseRepository');
const Contract = require('../models/contract');

class ContractRepository extends BaseRepository {
  constructor() {
    super(Contract);
  }

  /**
   * Obtener contratos de un cliente con paquete y servicios populados
   */
  async findByClient(clientId) {
    return await this.findAll(
      { client: clientId },
      { populate: ['client', 'package', 'services'], sort: { createdAt: -1 } }
    );
  }

  /**
   * Obtener un contrato por ID con todos los campos populados
   */
  async findByIdPopulated(id) {
    return await this.findById(id, { populate: ['client', 'package', 'services'] });
  }

  /**
   * Obtener contratos por estado
   */
  async findByStatus(status) {
    return await this.findAll(
      { status },
      { populate: ['client', 'package'], sort: { eventDate: 1 } }
    );
  }

  /**
   * Obtener contratos próximos (eventos en los próximos N días)
   */
  async findUpcoming(days = 7) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return await this.findAll(
      { eventDate: { $gte: now, $lte: future }, status: { $nin: ['cancelado'] } },
      { populate: 'client', sort: { eventDate: 1 } }
    );
  }
}

module.exports = new ContractRepository();
