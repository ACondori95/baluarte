const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    // Relación con el usuario: asegura que la categoría pertenece a una PyME específica
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    name: {type: String, required: true, trim: true},
    // Define si es Ingreso (Income) o Egreso (Expense)
    type: {type: String, required: true, enum: ["Ingreso", "Egreso"]},
    createdAt: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

// Índice único compuesto: No se puede tener dos categorías con el mismo nombre Y el mismo tipo para el MISMO usuario
CategorySchema.index({user: 1, name: 1, type: 1}, {unique: true});

module.exports = mongoose.model("Category", CategorySchema);
