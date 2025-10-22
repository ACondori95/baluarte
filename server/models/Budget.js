const mongoose = require("mongoose");

const BudgetSchema = mongoose.Schema(
  {
    // Relación con el usuario
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    // Relación con la Categoría (Solo se debe permitir categorías de Egreso)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    // Mes y Año para el cual aplica el presupuesto
    month: {type: Number, required: true, min: 1, max: 12},
    year: {type: Number, required: true},
    // El límite de gasto establecido
    limit: {type: Number, required: true, min: 0},
  },
  {timestamps: true}
);

// Índice único compuesto: Un usuario SOLO puede tener UN presupuesto para una categoría específica en un Mes/Año específico.
BudgetSchema.index({user: 1, category: 1, month: 1, year: 1}, {unique: true});

module.exports = mongoose.model("Budget", BudgetSchema);
