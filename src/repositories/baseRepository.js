/**
 * @file baseRepository.js
 * @description Repositorio base genérico para interactuar con Mongoose.
 * Proporciona métodos CRUD estándar heredables por repositorios específicos.
 */

class BaseRepository {
  /**
   * Inicializa el repositorio con un modelo específico de Mongoose.
   * @param {import('mongoose').Model} model - Modelo de Mongoose a utilizar.
   */
  constructor(model) {
    if (!model) {
      throw new Error('Se requiere un modelo de Mongoose para inicializar el repositorio.');
    }
    this.model = model;
  }

  /**
   * Crea y guarda un nuevo documento en la base de datos.
   * @param {Object} data - Datos para el nuevo registro.
   * @returns {Promise<import('mongoose').Document>} El documento creado.
   */
  async create(data) {
    const record = new this.model(data);
    return await record.save();
  }

  /**
   * Encuentra un documento por su ID.
   * @param {string} id - ID del documento (ObjectId).
   * @param {string|Object} [populateFields] - Propiedades que se desean popular (opcional).
   * @returns {Promise<import('mongoose').Document|null>} El documento encontrado o null.
   */
  async findById(id, populateFields = '') {
    let query = this.model.findById(id);
    if (populateFields) {
      query = query.populate(populateFields);
    }
    return await query.exec();
  }

  /**
   * Busca registros según un filtro.
   * @param {Object} [filter] - Filtros de consulta.
   * @param {string|Object} [populateFields] - Propiedades que se desean popular (opcional).
   * @param {Object} [options] - Opciones como paginación, ordenamiento (opcional).
   * @param {Object} [options.sort] - Criterio de ordenamiento.
   * @param {number} [options.limit] - Límite de resultados.
   * @param {number} [options.skip] - Saltarse registros.
   * @returns {Promise<Array<import('mongoose').Document>>} Lista de documentos que coinciden.
   */
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

  /**
   * Busca un solo registro que coincida con el filtro.
   * @param {Object} filter - Filtros de consulta.
   * @param {string|Object} [populateFields] - Propiedades que se desean popular (opcional).
   * @returns {Promise<import('mongoose').Document|null>} El documento encontrado o null.
   */
  async findOne(filter, populateFields = '') {
    let query = this.model.findOne(filter);
    if (populateFields) {
      query = query.populate(populateFields);
    }
    return await query.exec();
  }

  /**
   * Actualiza un documento existente por su ID.
   * @param {string} id - ID del documento (ObjectId).
   * @param {Object} data - Nuevos valores a asignar.
   * @returns {Promise<import('mongoose').Document|null>} El documento modificado o null.
   */
  async update(id, data) {
    return await this.model
      .findByIdAndUpdate(id, data, {
        new: true, // Retorna el documento actualizado
        runValidators: true, // Ejecuta las validaciones del esquema en la actualización
      })
      .exec();
  }

  /**
   * Elimina un documento por su ID.
   * @param {string} id - ID del documento (ObjectId).
   * @returns {Promise<import('mongoose').Document|null>} El documento eliminado o null.
   */
  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

module.exports = BaseRepository;
