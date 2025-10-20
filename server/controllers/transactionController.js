const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

/**
 * @desc   Obtener todas las transacciones del usuario
 * @route  GET /api/transactions
 * @access Privado
 */
const getTransactions = async (req, res) => {
  // 1. Encontrar transacciones del usuario, ordenadas de más reciente a más antigua
  // 2. Usar .populate('category') para obtener los detalles del objeto Categoría (ej: el nombre)
  const transactions = await Transaction.find({user: req.user._id})
    .populate("category", "name type") // Solo trae el nombre y el tipo de la categoría
    .sort({date: -1, createdAt: -1});

  res.json(transactions);
};

/**
 * @desc   Crear una nueva transacción
 * @route  POST /api/transactions
 * @access Privado
 */
const createTransaction = async (req, res) => {
  const {categoryId, amount, description, date} = req.body;

  if (!categoryId || !amount || !date) {
    return res
      .status(400)
      .json({message: "Faltan campos requeridos: categoría, monto y fecha."});
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

  try {
    // 2. Crear la transacción
    const transaction = new Transaction({
      user: req.user._id,
      category: categoryId,
      type: category.type, // Usamos el tipo definido en la categoría para consistencia
      amount,
      description,
      date: new Date(date), // Asegura que la fecha esté en formato Date
    });

    const createdTransaction = await transaction.save();
    // 3. Poblar la categoría en la respuesta para el frontend
    await createdTransaction.populate("category", "name type");

    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar la transacción.",
      error: error.message,
    });
  }
};

/**
 * @desc   Eliminar una transacción
 * @route  DELETE /api/transactions/:id
 * @access Private
 */
const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (transaction) {
    // Verificar que la transacción pertenece al usuario
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({message: "No estás autorizado para eliminar esta transacción."});
    }

    await transaction.deleteOne();
    res.json({message: "Transacción eliminada con éxito."});
  } else {
    res.status(404).json({message: "Transacción no encontrada."});
  }
};

module.exports = {getTransactions, createTransaction, deleteTransaction};
