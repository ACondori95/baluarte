import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    // Referencia del usuario que creó el presupuesto
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    // La categoría específica a la que se aplica este presupuesto
    category: {
      type: String,
      required: [true, "La categoría del presupuesto es obligatoria"],
      unique: true,
      trim: true,
    },
    // El monto máximo presupuestado para el mes
    limit: {
      type: Number,
      required: [true, "El límite presupuestario es obligatorio"],
      min: [0, "El límite no puede ser negativo"],
    },
    // Mes y año al que aplica este presupuesto (ej. "2025-10")
    period: {
      type: String,
      required: [true, "El período (mes/año) es obligatorio"],
      match: [/^\d{4}-\d{2}$/, "El formato debe ser YYYY-MM (ej. 2025-10)"],
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto: Asegura que un usuario solo pueda tener un presupuesto
// para una categoría específica en un período de tiempo dado.
BudgetSchema.index({user: 1, category: 1, period: 1}, {unique: true});

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
