const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fieldEncryption = require("mongoose-field-encryption").fieldEncryption;

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
      select: false, 
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
    deletedAt: {
      type: Date,
      default: null,
    },
    dataConsent: {
      type: Map,
      of: Boolean,
      default: {
        marketing:  true,
        analytics:  true,
        thirdParty: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(fieldEncryption, {
  fields:  ['phoneNumber'],
  secret:  process.env.FIELD_ENCRYPTION_KEY,
  saltGenerator: (secret) => secret.slice(0, 16), 
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

UserSchema.pre(/^find/, function () {
  if (!this._mongooseOptions?.includeDeleted) {
    this.where({ deletedAt: null });
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  this.status = 'inactive';
  await this.save();
  return this;
};

UserSchema.methods.restore = async function () {
  this.deletedAt = null;
  this.status = 'active';
  await this.save();
  return this;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;