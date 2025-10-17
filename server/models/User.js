import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definición del esquema del usuario
const UserSchema = new mongoose.Schema({
  // Campo para el nombre de la PyME o el nombre completo del usuario
  businessName: {
    type: String,
    required: [true, "El nombre del negocio es obligatorio"],
    trim: true,
    maxlength: [100, "El nombre no puede superar los 100 caracteres"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Por favor, ingrese un correo válido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    select: false,
  },
  // Rol del usuario: 'free', 'pro', o 'premium'
  plan: {type: String, enum: ["free", "pro", "premium"], default: "free"},
  // Campo para la ID de la subscripción de Mercado Pago (futura implementación)
  mpSubscriptionId: {type: String, default: null},
  // Fecha de creación de la cuenta
  createdAt: {type: Date, default: Date.now},
  // Campo para la cerificación del email (futuro)
  isVerified: {type: Boolean, default: false},
});

// Middleware: Hashea la contraseña antes de guardarla
UserSchema.pre("save", async function (next) {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método: Compara la contraseña ingresada con la hasheada
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Nota: El 'select: false' en el esquema significa que necesitamos el método .select('+password')
  // en el controlador de login para acceder a 'this.password'
  return await bcrypt.compare(enteredPassword, this.password);
};

// Crear y exportar el modelo
const User = mongoose.model("User", UserSchema);

export default User;
