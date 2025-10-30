const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    // Datos de Autenticación
    username: {
      type: String,
      required: [true, "Por favor, añade un nombre de usuario."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Por favor, añade un correo electrónico."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Por favor, añade una contraseña."],
    },
    // Datos de Negocio (Configuración inicial)
    businessName: {
      type: String,
      default: "", // Se establece al configurar el perfil
    },
    mainCurrency: {
      type: String,
      default: "ARS",
      enum: ["ARS", "USD"], // Limitado por el plan (Base solo ARS)
    },
    // Datos de Suscripción/Monetización
    role: {
      type: String,
      enum: ["base", "pro"],
      default: "base", // Rol inicial es Plan Base
    },
    // Un campo para saber si el usuario completó la configuración inicial del negocio
    profileConfigured: {type: Boolean, default: false},
  },
  {
    timestamps: true, // Añade createdAt y updatedAt
  }
);

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar la contraseña ingresada con la encriptada
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
