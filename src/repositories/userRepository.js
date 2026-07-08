const BaseRepository = require('./baseRepository');
const UserModel = require('../models/user');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email) {
    if (!email) return null;
    return await this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByEmailWithPassword(email) {
    if (!email) return null;
    return await this.model
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }

  async findByRole(role) {
    return await this.find({ role, status: 'active' });
  }
}

module.exports = UserRepository;
