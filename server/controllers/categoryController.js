const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

/**
 * @desc   Obtener todas las categorías del usuario
 * @route  GET /api/categories
 * @access Private
 */
const getCategories = asyncHandler(async (req, res) => {
  // Solo obtenemos categorías activas (isActive: true)
  const categories = await Category.find({
    user: req.user._id,
    isActive: true,
  }).sort({type: 1, name: 1});

  res.json(categories);
});

/**
 * @desc   Crear una nueva categoría
 * @route  POST /api/categories
 * @access Private
 */
const createCategory = asyncHandler(async (req, res) => {
  const {name, type, monthlyBudget} = req.body;

  if (!name || !type) {
    res.status(400);
    throw new Error(
      "Por favor, ingresa el nombre y el tipo (INGRESO/EGRESO) para la categoría."
    );
  }

  // 1. Verificar si ya existe una categoría con ese nombre para este usuario
  const categoryExists = await Category.findOne({user: req.user._id, name});

  if (categoryExists) {
    res.status(400);
    throw new Error("Ya existe una categoría con ese nombre.");
  }

  // 2. Crear la categoría
  const category = await Category.create({
    user: req.user._id,
    name,
    type,
    monthlyBudget: monthlyBudget || 0, // Si no se proporciona presupuesto, es 0
  });

  res.status(201).json(category);
});

/**
 * @desc   Actualizar Categoría y Presupuesto
 * @route  PUT /api/categories/:id
 * @access Private
 */
const updateCategory = asyncHandler(async (req, res) => {
  const {name, type, monthlyBudget} = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    // 1. Asegurar que el usuario es el dueño de la categoría
    if (category.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("No autorizado para actualizar esta categoría");
    }

    // 2. Actualizar campos
    category.name = name || category.name;
    category.type = type || category.type;
    category.monthlyBudget =
      monthlyBudget !== undefined ? monthlyBudget : category.monthlyBudget;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

/**
 * @desc   Eliminar una categoría (Eliminación suave)
 * @route  DELETE /api/categories/:id
 * @access Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // 1. Asegurar que el usuario es el dueño
    if (category.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("No autorizado para eliminar esta categoría");
    }

    // 2. Eliminación suave (Soft Delete) - La guardamos como iniciativa
    // Esto es más seguro que borrarla si ya hay transacciones asociadas.
    category.isActive = false;
    await category.save();

    res.json({message: "Categoría marcada como inactiva (eliminación suave)."});
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
