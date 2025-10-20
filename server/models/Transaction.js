const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    // Relación con el usuario (la PyME)
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    // Relación con la Categoría (ej: Ventas MP, Alquileres)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    // Tipo (debe coincidir con el tipo de la Categoría, pero lo guardamos para facilidad de consulta)
    type: {type: String, required: true, enum: ["Ingreso", "Egreso"]},
    amount: {type: Number, required: true, min: 0.01},
    // Fecha en que ocurrió la transacción (no la fecha de creación en la DB)
    date: {type: Date, required: true},
  },
  {timestamps: true}
);

module.exports = mongoose.model("Transaction", TransactionSchema);
