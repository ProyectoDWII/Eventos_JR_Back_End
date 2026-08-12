const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio'],
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
    category: {
      type: String,
      enum: ['fotografia', 'video', 'album', 'edicion', 'otro'],
      default: 'fotografia',
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

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
