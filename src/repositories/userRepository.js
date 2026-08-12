const BaseRepository = require('./baseRepository');
const User = require('../models/user');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Buscar usuario por email (incluye contraseña para autenticación)
   */
  async findByEmailWithPassword(email) {
    return await this.model.findOne({ email }).select('+password');
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    return await this.findOne({ email });
  }

  /**
   * Obtener solo usuarios activos
   */
  async findAllActive() {
    return await this.findAll({ active: true });
  }

  /**
   * Obtener usuarios por rol
   */
  async findByRole(role) {
    return await this.findAll({ role, active: true });
  }

  /**
   * Desactivar usuario (soft delete)
   */
  async deactivate(id) {
    return await this.updateById(id, { active: false });
  }
}

module.exports = new UserRepository();
