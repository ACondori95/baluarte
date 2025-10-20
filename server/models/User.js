const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Usaremos bcrypt para hashear la contraseña

const UserSchema = mongoose.Schema({
  name: {type: String, required: true, trim: true},
  email: {
    type: String,
    required: true,
    unique: true, // Asegura que no haya dos usuarios con el mismo email
    trim: true,
    lowercase: true,
  },
  password: {type: String, required: true},
  // Campo clave para la estrategia de monetización
  plan: {type: String, enum: ["Base", "Pro", "Premium"], default: "Base"},
  createdAt: {type: Date, default: Date.now},
});

// Middleware (Hook) de Mongoose: Hashear la contraseña antes de guardar
UserSchema.pre("save", async function (next) {
  // Solo hashear si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified("password")) {
    next();
  }

  // Generar el salt (cadena aleatoria) y luego hashear
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para el modelo: Comparar la contraseña ingresada con la hasheada en DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Retorna true si la contraseña coincide
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
