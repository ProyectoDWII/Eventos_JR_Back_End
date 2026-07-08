const mongoose = require('mongoose');
const SolicitudSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente es obligatorio'],
    },
    eventType: {
      type: String,
      required: [true, 'El tipo de evento es obligatorio'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'La fecha del evento es obligatoria'],
    },
    location: {
      type: String,
      required: [true, 'La ubicación del evento es obligatoria'],
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'cancelled'],
        message: 'Estado de solicitud no válido. Debe ser pending, approved, rejected o cancelled',
      },
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SolicitudModel = mongoose.model('Solicitud', SolicitudSchema);

module.exports = SolicitudModel;
