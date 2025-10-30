const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Enlaza la categoría al usuario dueño
    },
    name: {
      type: String,
      required: [true, "El nombre de la categoría es requerido."],
      trim: true,
    },
    type: {
      type: String,
      enum: ["INGRESO", "EGRESO"],
      required: [true, "El tipo de categoría (INGRESO/EGRESO) es requerido."],
    },
    monthlyBudget: {type: Number, default: 0},
    // Útil para permitir que las categorías se puedan desactivar o eliminar suavemente
    isActive: {type: Boolean, default: true},
  },
  {timestamps: true}
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
