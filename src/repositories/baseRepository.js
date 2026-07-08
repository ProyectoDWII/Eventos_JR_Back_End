class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Se requiere un modelo de Mongoose para inicializar el repositorio.');
    }
    this.model = model;
  }

  async create(data) {
    const record = new this.model(data);
    return await record.save();
  }

  async findById(id, populateFields = '') {
    let query = this.model.findById(id);
    if (populateFields) {
      query = query.populate(populateFields);
    }
    return await query.exec();
  }

  async find(filter = {}, populateFields = '', options = {}) {
    let query = this.model.find(filter);

    if (populateFields) {
      query = query.populate(populateFields);
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.skip) {
      query = query.skip(options.skip);
    }

    return await query.exec();
  }

  async findOne(filter, populateFields = '') {
    let query = this.model.findOne(filter);
    if (populateFields) {
      query = query.populate(populateFields);
    }
    return await query.exec();
  }

  async update(id, data) {
    return await this.model
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

module.exports = BaseRepository;
