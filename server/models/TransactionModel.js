const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Enlaza la transacción al usuario dueño
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "La categoría es requerida."],
      ref: "Category", // Enlaza la transacción a una categoría específica
    },
    type: {
      type: String,
      enum: ["INGRESO", "EGRESO"],
      required: [true, "El tipo de transacción (INGRESO/EGRESO) es requerido."],
    },
    amount: {type: Number, required: [true, "El monto es requerido."]},
    date: {
      type: Date,
      required: [true, "La fecha es requerida."],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "La descripción es requerida."],
    },
  },
  {timestamps: true}
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
