import Budget from "../models/Budget.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError.js";

/**
 * @desc Valida el formato del período (YYYY-MM)
 */
const validatePeriodFormat = (period) => {
  if (!/^\d{4}-\d{2}$/.test(period)) {
    throw new BadRequestException(
      "El formato del período debe ser YYYY-MM (ej. 2025-10)"
    );
  }
};

// --- Controladores CRUD ---

/**
 * @route POST /api/budgets
 * @desc Crea un nuevo límite de presupuesto mensual.
 * @access Private
 */
const createBudget = asyncHandler(async (req, res) => {
  const {category, limit, period} = req.body;
  const userId = req.user._id;

  // 1. Validar datos de entrada
  if (!category || limit === undefined || !period) {
    throw new BadRequestException(
      "Faltan campos obligatorios: categoría, límite y período."
    );
  }
  validatePeriodFormat(period);

  try {
    // 2. Crear el presupuesto vinculándolo al usuario autenticado
    const budget = await Budget.create({user: userId, category, limit, period});

    res.status(201).json({success: true, data: budget});
  } catch (error) {
    // Manejar el error de índice único (duplicado) definido del modelo
    if (error.code === 11000) {
      throw new BadRequestException(
        "Ya existe un presupuesto para esta categoría y período."
      );
    }
    throw error; // Re-lanzar otros errores
  }
});

/**
 * @route GET /api/budget
 * @desc Obtiene todos los presupuestos del usuario, opcionalemente filtrados por período.
 * @access Private
 */
const getBudgets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {period} = req.query; // Obtener el período del query (ej: ?period=2025-10)

  let filter = {user: userId};

  if (period) {
    validatePeriodFormat(period);
    filter.period = period;
  }

  // Busca presupuestos que pertenezcan al usuario y al período (si se especificó)
  const budgets = await Budget.find(filter).sort({period: -1, category: 1});

  res.status(200).json({success: true, cont: budgets.length, data: budgets});
});

/**
 * @route PUT /api/budgets/:id
 * @desc Actualiza un límite de presupuesto existente
 * @access Private
 */
const updateBudget = asyncHandler(async (req, res) => {
  const budgetId = req.params.id;
  const updates = req.body;

  // 1. Buscar el presupuesto por ID
  let budget = await Budget.findById(budgetId);

  if (!budget) {
    throw new NotFoundException("Presupuesto no encontrado.");
  }

  // 2. Verificar que el presupuesto pertenezca al usuario autenticado
  if (budget.user.toString() !== req.user._id.toString()) {
    throw new UnauthorizedException(
      "No está autorizado para actualizar este presupuesto."
    );
  }

  // 3. Aplicar y validar actualizaciones
  budget.set(updates);

  // Si se está actualizando el período, validamos el formato
  if (updates.period) {
    validatePeriodFormat(updates.period);
  }

  await budget.validate();
  budget = await budget.save();

  res.status(200).json({success: true, data: budget});
});

/**
 * @route DELETE /api/budgets/:id
 * @desc Elimina un presupuesto.
 * @access Private
 */
const deleteBudget = asyncHandler(async (req, res) => {
  const budgetId = req.params.id;

  const budget = await Budget.findById(budgetId);

  if (!budget) {
    throw new NotFoundException("Presupuesto no encontrado.");
  }

  // Verificar que el presupuesto pertenece al usuario autenticado
  if (budget.user.toString() !== req.user._id.toString()) {
    throw new UnauthorizedException(
      "No está autorizado para eliminar este presupuesto."
    );
  }

  // Eliminar el presupuesto
  await Budget.deleteOne({_id: budgetId});

  res
    .status(200)
    .json({success: true, message: "Presupuesto eliminado con éxito."});
});

export {createBudget, getBudgets, updateBudget, deleteBudget};
