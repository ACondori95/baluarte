const asyncHandler = require("express-async-handler");
const Transaction = require("../models/TransactionModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");

// Límite de transacciones para el plan "base"
const BASE_TRANSACTION_LIMIT = 50;

/**
 * @desc   Obtener todas las transacciones del usuario
 * @route  GET /api/transactions
 * @access Private
 */
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({user: req.user._id})
    .populate("category", "name type") // Rellenar la referencia a Categoría solo con el nombre y el tipo
    .sort({date: -1}); // Ordenar por fecha descendente (las más recientes primero)

  res.json(transactions);
});

/**
 * @desc   Crear una nueva transacción (Ingreso/Egreso)
 * @route  POST /api/transactions
 * @access Private
 */
const createTransaction = asyncHandler(async (req, res) => {
  const {amount, date, categoryId, description, type} = req.body;

  if (!amount || !categoryId || !description || !type) {
    res.status(400);
    throw new Error(
      "Todos los campos son obligatorios: monto, fecha, categoría, descripción y tipo."
    );
  }

  // 1. Validar Límite de Transacciones
  const user = await User.findById(req.user._id);

  if (user.role === "base") {
    // Contar las transacciones del mes actual
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const transactionsCount = await Transaction.countDocuments({
      user: req.user._id,
      date: {$gte: startOfMonth, $lte: endOfMonth},
    });

    if (transactionsCount >= BASE_TRANSACTION_LIMIT) {
      // Mostrar Mensaje: Límite de Transacciones Alcanzado
      res.status(403); // 403 Forbidden
      throw new Error(
        `Límite de ${BASE_TRANSACTION_LIMIT} transacciones por mes alcanzado. Por favor, actualiza al Plar PRO para transacciones ilimitadas.`
      );
    }
  }

  // 2. Validar que la categoría existe y pertenece al usuario
  const category = await Category.findOne({
    _id: categoryId,
    user: req.user._id,
  });

  if (!category) {
    res.status(404);
    throw new Error("Categoría no encontrada o no pertenece al usuario.");
  }

  // 3. Crear la Transacción
  const transaction = await Transaction.create({
    user: req.user._id,
    category: categoryId,
    amount,
    date: date || Date.now(),
    description,
    type, // Debe ser 'INGRESO' o 'EGRESO'
  });

  res.status(201).json(transaction);
});

/**
 * @desc   Eliminar una transacción
 * @route  DELETE /api/transactions/:id
 * @access Private
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (transaction) {
    // 1. Asegurar que el usuario es el dueño de la transacción
    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("No autorizado para eliminar esta transacción");
    }

    await transaction.deleteOne();

    res.json({message: "Transacción eliminada exitosamente."});
  } else {
    res.status(404);
    throw new Error("Transacción no encontrada");
  }
});

module.exports = {getTransactions, createTransaction, deleteTransaction};
