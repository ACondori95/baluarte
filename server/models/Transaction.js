import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    // Referencia al usuario que creó la transacción
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    // Tipo de transacción: Ingreso o Egreso
    type: {type: String, enum: ["income", "expense"], required: true},
    // Monto de la transacción
    amount: {
      type: Number,
      required: [true, "El monto es obligatorio"],
      min: [0.01, "El monto debe ser mayor a cero"],
    },
    // Categoría de la transacción (ej. Ventas, Salarios, Alquiler)
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      maxlength: [50, "La categoría no puede superar los 50 caracteres"],
    },
    // Descripción o nota de la transacción
    descriotion: {
      type: String,
      trim: true,
      maxlength: [200, "La descripción no puede superar los 200 caracteres"],
    },
    // Fecha en que ocurrió la transacción (por defecto, hoy)
    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
      default: Date.now,
    },
  },
  {
    // Añade automáticamente campos 'createdAt' y 'updatedAt'
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
