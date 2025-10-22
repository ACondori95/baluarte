const Budget = require("../models/Budget");
const Category = require("../models/Category");

/**
 * @desc   Obtener todos los presupuestos del usuario
 * @route  GET /api/budget
 * @access Privado
 */
const getBudgets = async (req, res) => {
  const budgets = await Budget.find({user: req.user._id})
    .populate("category", "name type")
    .sort({year: -1, month: -1});

  res.json(budgets);
};

/**
 * @desc   Crear o actualizar un presupuesto
 * @route  POST /api/budgets
 * @access Privado
 */
const setBudget = async (req, res) => {
  const {categoryId, limit, month, year} = req.body;

  if (!categoryId || limit === undefined || !month || !year) {
    return res.status(400).json({
      message: "Faltan campos requeridos: categoría, límite, mes y año.",
    });
  }

  // 1. Verificar si la categoría existe y pertenece al usuario
  const category = await Category.findOne({
    _id: categoryId,
    user: req.user._id,
  });

  if (!category) {
    return res
      .status(404)
      .json({message: "Categoría no encontrada o no te pertenece."});
  }

  // 2. Validación crítica: Solo permitir presupuestos para categorías de Egreso
  if (category.type !== "Egreso") {
    return res.status(400).json({
      message:
        "Solo se pueden establecer presupuestos para categorías de Egreso.",
    });
  }

  try {
    // 3. User findOneAndUpdate para crear o actualizar (Upsert) el presupuesto.
    // Buscamos si ya existe un presupuesto para ese Mes/Año/Categoría
    const budget = await Budget.findOneAndUpdate(
      {user: req.user._id, category: categoryId, month, year},
      {limit},
      {new: true, upsert: true, runValidators: true}
    ).populate("category", "name type");

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al establecer el presupuesto.",
      error: error.message,
    });
  }
};

/**
 * @desc   Eliminar un presupuesto
 * @route  DELETE /api/budgets/:id
 * @access Privado
 */
const deleteBudget = async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (budget) {
    // Verificar que el presupuesto pertenezca al usuario
    if (budget.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({message: "No estás autorizado para eliminar este presupuesto."});
    }

    await budget.deleteOne();
    res.json({message: "Presupuesto eliminado con éxito."});
  } else {
    res.status(404).json({message: "Presupuesto no encontrado."});
  }
};

module.exports = {getBudgets, setBudget, deleteBudget};
