const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente es obligatorio'],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    eventDate: {
      type: Date,
      required: [true, 'La fecha del evento es obligatoria'],
    },
    eventLocation: {
      type: String,
      required: [true, 'La ubicación del evento es obligatoria'],
    },
    eventType: {
      type: String,
      enum: ['boda', 'quinceañera', 'cumpleaños', 'corporativo', 'graduacion', 'otro'],
      required: [true, 'El tipo de evento es obligatorio'],
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pendiente', 'revisando', 'aprobada', 'rechazada'],
      default: 'pendiente',
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
