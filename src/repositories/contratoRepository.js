const BaseRepository = require('./baseRepository');
const ContratoModel = require('../models/contract');

class ContratoRepository extends BaseRepository {
  constructor() {
    super(ContratoModel);
  }

  async findByIdWithDetails(id) {
    return await this.findById(id, 'client solicitud');
  }

  async findByClientId(clientId) {
    return await this.find({ client: clientId }, 'solicitud', { sort: { createdAt: -1 } });
  }

  async findBySolicitudId(solicitudId) {
    if (!solicitudId) return null;
    return await this.findOne({ solicitud: solicitudId });
  }

  async updatePaymentStatus(id, paymentStatus) {
    return await this.update(id, { paymentStatus });
  }

  async updateContractStatus(id, status, signedAt = null) {
    const updateData = { status };
    if (signedAt || status === 'signed') {
      updateData.signedAt = signedAt || new Date();
    }
    return await this.update(id, updateData);
  }
}

module.exports = ContratoRepository;
