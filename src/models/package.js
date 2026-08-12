const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del paquete es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    duration: {
      type: Number, // horas de cobertura
      required: [true, 'La duración es obligatoria'],
    },
    photos: {
      type: Number, // cantidad de fotos incluidas
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
