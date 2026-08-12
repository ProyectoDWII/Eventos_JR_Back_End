const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // no se devuelve por defecto en queries
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
    phone: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparar contraseña ingresada con la almacenada
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
