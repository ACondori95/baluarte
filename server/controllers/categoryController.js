const Category = require("../models/Category");

/**
 * @desc   Obtener todas las categorías del usuario autenticado
 * @route  GET /api/categories
 * @access Privado
 */
const getCategories = async (req, res) => {
  // Solo trae las categorías cuyo campo 'user' coincida con el ID del usuario autenticado.
  const categories = await Category.find({user: req.user._id}).sort({name: 1});
  res.json(categories);
};

/**
 * @desc   Crear una nueva categoría
 * @route  POST /api/categories
 * @access Privado
 */
const createCategory = async (req, res) => {
  const {name, type} = req.body;

  if (!name || !type) {
    return res.status(400).json({
      message: "Por favor, añade un nombre y un tipo (Ingreso y Egreso).",
    });
  }

  // Convertir el nombre y el título (opcional, pero ayuda a la consistencia)
  const formattedName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  try {
    const category = new Category({
      name: formattedName,
      type,
      user: req.user._id,
    });

    const createdCategory = await category.save();
    // Código 201: Creado
    res.status(201).json(createdCategory);
  } catch (error) {
    // Si la categoría ya existe (debido al índice único), MongoDB lanza un error 11000
    if (error.code === 11000) {
      return res
        .status(400)
        .json({message: "Ya tienes una categoría con ese nombre y tipo."});
    }
    // Otros errores (ej. tipo inválido)
    res
      .status(500)
      .json({message: "Error al crear la categoría.", error: error.message});
  }
};

/**
 * @desc   Actualizar una categoría
 * @route  PUT /api/categories/:id
 * @access Privado
 */
const updateCategory = async (req, res) => {
  const {name, type} = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    // 1. Verificar que la categoría pertenezca al usuario autenticado
    if (category.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({message: "No estás autorizado para actualizar esta categoría."});
    }

    // 2. Actualizar tiempos
    category.name = name || category.name;
    category.type = type || category.type;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404).json({message: "Categoría no encontrada."});
  }
};

/**
 * @desc   Eliminar una categoría
 * @route  DELETE /api/categories/:id
 * @access Privado
 */
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // 1. Verificar que la categoría pertenezca al usuario autenticado
    if (category.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({message: "No estás autorizado para eliminar esta categoría."});
    }

    // Aquí podrás añadir una lógica para verificar si hay transacciones
    // asociadas antes de eliminar, pero para el MVP lo haremos simple.

    await category.deleteOne(); // Usamos deleteOne() en Mongoose v6+
    res.json({message: "Categoría eliminada con éxito."});
  } else {
    res.status(404).json({message: "Categoría no encontrada."});
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
