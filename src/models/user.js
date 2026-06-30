// src/models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* Esquema de Mongoose para el Usuario */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor proporcione un correo electrónico válido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // Oculta la contraseña por defecto en las consultas
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "client"],
        message: "Rol no válido. Debe ser admin o client",
      },
      default: "client",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  },
);

/* Middleware pre-save de Mongoose para encriptar contraseñas - CORREGIDO */
UserSchema.pre("save", async function () {
  // Solo hashear si la contraseña fue modificada o es nueva
  if (!this.isModified("password")) {
    return; // Salir sin hashear
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Lanzar el error para que Mongoose lo maneje
    throw error;
  }
});

/* Compara una contraseña ingresada con la almacenada encriptada en la BD */
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;