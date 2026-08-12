/**
 * BaseRepository - Patrón Repository
 * Proporciona operaciones CRUD básicas para cualquier modelo de Mongoose.
 * Los repositorios específicos extienden esta clase.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Obtener todos los documentos
   * @param {Object} filter - Filtros de búsqueda
   * @param {Object} options - Opciones (populate, select, sort, limit, skip)
   */
  async findAll(filter = {}, options = {}) {
    let query = this.model.find(filter);

    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    if (options.sort) query = query.sort(options.sort);
    if (options.limit) query = query.limit(options.limit);
    if (options.skip) query = query.skip(options.skip);

    return await query.exec();
  }

  /**
   * Buscar un documento por ID
   */
  async findById(id, options = {}) {
    let query = this.model.findById(id);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    return await query.exec();
  }

  /**
   * Buscar un documento por filtro
   */
  async findOne(filter, options = {}) {
    let query = this.model.findOne(filter);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    return await query.exec();
  }

  /**
   * Crear un nuevo documento
   */
  async create(data) {
    const doc = new this.model(data);
    return await doc.save();
  }

  /**
   * Actualizar un documento por ID
   */
  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Eliminar un documento por ID (soft delete si tiene campo 'active')
   */
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Contar documentos
   */
  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;
