/**
 * @file contract.js
 * @description Modelo de Mongoose para la entidad de Contrato (ContratoModel).
 */

const mongoose = require('mongoose');

/**
 * Esquema de Mongoose para el Contrato
 */
const ContractSchema = new mongoose.Schema(
  {
    solicitud: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Solicitud',
      required: [true, 'La solicitud asociada al contrato es obligatoria'],
      unique: true, // Cada solicitud solo puede tener un contrato
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente asociado al contrato es obligatorio'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'El monto total es obligatorio'],
      min: [0, 'El monto total no puede ser negativo'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'partial', 'paid'],
        message: 'Estado de pago no válido. Debe ser pending, partial o paid',
      },
      default: 'pending',
    },
    terms: {
      type: String,
      required: [true, 'Los términos y condiciones del contrato son obligatorios'],
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'active', 'signed', 'completed', 'cancelled'],
        message: 'Estado de contrato no válido. Debe ser draft, active, signed, completed o cancelled',
      },
      default: 'draft',
    },
    signedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ContratoModel = mongoose.model('Contract', ContractSchema);

module.exports = ContratoModel;
