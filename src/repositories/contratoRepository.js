/**
 * @file contratoRepository.js
 * @description Repositorio específico para la entidad de Contrato (ContratoModel).
 */

const BaseRepository = require('./baseRepository');
const ContratoModel = require('../models/contract');

class ContratoRepository extends BaseRepository {
  constructor() {
    super(ContratoModel);
  }

  /**
   * Obtiene un contrato por su ID, poblando el cliente y la solicitud asociada.
   * @param {string} id - ID del contrato.
   * @returns {Promise<import('mongoose').Document|null>} El contrato poblado o null.
   */
  async findByIdWithDetails(id) {
    return await this.findById(id, 'client solicitud');
  }

  /**
   * Obtiene todos los contratos que pertenecen a un cliente específico.
   * @param {string} clientId - ID del cliente.
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de contratos del cliente.
   */
  async findByClientId(clientId) {
    return await this.find({ client: clientId }, 'solicitud', { sort: { createdAt: -1 } });
  }

  /**
   * Obtiene el contrato asociado a una solicitud específica.
   * @param {string} solicitudId - ID de la solicitud (aplication).
   * @returns {Promise<import('mongoose').Document|null>} El contrato correspondiente o null.
   */
  async findBySolicitudId(solicitudId) {
    if (!solicitudId) return null;
    return await this.findOne({ solicitud: solicitudId });
  }

  /**
   * Actualiza el estado del pago del contrato.
   * @param {string} id - ID del contrato.
   * @param {string} paymentStatus - Nuevo estado de pago ('pending', 'partial', 'paid').
   * @returns {Promise<import('mongoose').Document|null>} El contrato actualizado o null.
   */
  async updatePaymentStatus(id, paymentStatus) {
    return await this.update(id, { paymentStatus });
  }

  /**
   * Actualiza el estado general del contrato.
   * @param {string} id - ID del contrato.
   * @param {string} status - Nuevo estado ('draft', 'active', 'signed', 'completed', 'cancelled').
   * @param {Date} [signedAt] - Fecha opcional de firma.
   * @returns {Promise<import('mongoose').Document|null>} El contrato actualizado o null.
   */
  async updateContractStatus(id, status, signedAt = null) {
    const updateData = { status };
    if (signedAt || status === 'signed') {
      updateData.signedAt = signedAt || new Date();
    }
    return await this.update(id, updateData);
  }
}

module.exports = ContratoRepository;
