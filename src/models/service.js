/**
 * @file service.js
 * @description Modelo de Mongoose para la entidad de Servicio (ServicioModel).
 */

const mongoose = require('mongoose');

/**
 * Esquema de Mongoose para el Servicio
 */
const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción del servicio es obligatoria'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio del servicio es obligatorio'],
      min: [0, 'El precio no puede ser un valor negativo'],
    },
    category: {
      type: String,
      required: [true, 'La categoría del servicio es obligatoria'],
      enum: {
        values: ['photography', 'catering', 'music', 'decoration', 'other'],
        message: 'Categoría no válida. Debe ser: photography, catering, music, decoration u other',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const ServicioModel = mongoose.model('Service', ServiceSchema);

module.exports = ServicioModel;
