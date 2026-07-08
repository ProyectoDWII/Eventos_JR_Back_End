const mongoose = require('mongoose');
const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del paquete es obligatorio'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción del paquete es obligatoria'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio del paquete es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        description: 'Lista de servicios opcionales o por defecto incluidos en el paquete',
      },
    ],
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

const PaqueteModel = mongoose.model('Package', PackageSchema);

module.exports = PaqueteModel;
