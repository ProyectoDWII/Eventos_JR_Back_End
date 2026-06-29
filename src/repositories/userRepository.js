/**
 * @file userRepository.js
 * @description Repositorio específico para la entidad de Usuario (UserModel).
 */

const BaseRepository = require('./baseRepository');
const UserModel = require('../models/user');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<import('mongoose').Document|null>} El usuario encontrado o null.
   */
  async findByEmail(email) {
    if (!email) return null;
    return await this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Busca un usuario por su correo electrónico incluyendo la contraseña (útil para login).
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<import('mongoose').Document|null>} El usuario con su contraseña o null.
   */
  async findByEmailWithPassword(email) {
    if (!email) return null;
    return await this.model
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }

  /**
   * Obtiene todos los usuarios con un rol específico.
   * @param {string} role - Rol de usuario ('admin', 'client', etc.)
   * @returns {Promise<Array<import('mongoose').Document>>}
   */
  async findByRole(role) {
    return await this.find({ role, status: 'active' });
  }
}

module.exports = UserRepository;
