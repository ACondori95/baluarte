import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError.js";

// --- Utilerías ---

/**
 * @desc Valida los campos básicos de una transacción.
 */
const validateTransactionFields = (type, amount, category, date) => {
  if (!type || !amount || !category || !date) {
    throw new BadRequestException(
      "Faltan campos obligatorios: tipo, monto, categoría y fecha."
    );
  }
  if (!["income", "express"].includes(type)) {
    throw new BadRequestException(
      'El tipo de transacción debe ser "income" o "expense".'
    );
  }
  if (isNaN(amount) || amount <= 0) {
    throw new BadRequestException("El monto debe ser un número positivo.");
  }
};

// --- Controladores CRUD ---
/**
 * @route POST /api/transactions
 * @desc Crea una nueva transacción (Ingreso o Egreso)
 * @access Private
 */
const createTransaction = asyncHandler(async (req, res) => {
  const {type, amount, category, description, date} = req.body;

  // Validar datos de entrada
  validateTransactionFields(type, amount, category, date);

  // Crea la transacción vinculándola al usuario autenticado (req.user)
  const transaction = await Transaction.create({
    user: req.user._id,
    type,
    amount,
    category,
    description,
    date,
  });

  res.status(201).json({success: true, data: transaction});
});

/**
 * @route GET /api/transactions/:id
 * @desc Obtiene todas las transacciones del usuario.
 * @access Private
 */
const getTransactions = asyncHandler(async (req, res) => {
  // Busca todas las transacciones que pertenezcan al usuario autenticado
  const transactions = await Transaction.find({user: req.user._id}).sort({
    date: -1,
  });

  res
    .status(200)
    .json({success: true, count: transactions.length, data: transactions});
});

/**
 * @route PUT /api/transactions/:id
 * @desc Actualiza una transacción existente
 * @access Private
 */
const updateTransaction = asyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const updates = req.body;

  // 1. Buscar la transacción por ID
  let transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new NotFoundException("Transacción no encontrada.");
  }

  // 2. Verificar que la transacción pertenezca al usuario autenticado
  if (transaction.user.toString() !== req.user._id.toString()) {
    throw new UnauthorizedException(
      "No está autorizado para actualizar esta transacción."
    );
  }

  // 3. Aplicar y validar actualizaciones antes de guardar
  // Usamos .set() para aplicar actualizaciones y new: true para devolver el documento actualizado
  transaction.set(updates);
  await transaction.validate();
  transaction = await transaction.save();

  res.status(200).json({success: true, data: transaction});
});

/**
 * @route DELETE /api/transactions/:id
 * @desc Elimina una transacción
 * @access Private
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  const transactionId = req.params.id;

  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new NotFoundException("Transacción no encontrada");
  }

  // Verificar que la transacción pertenezca al usuario autenticado
  if (transaction.user.toString() !== req.user._id.toString()) {
    throw new UnauthorizedException(
      "No está autorizado para eliminar esta transacción."
    );
  }

  // Eliminar la transacción
  await Transaction.deleteOne({_id: transactionId});

  res
    .status(200)
    .json({success: true, message: "Transacción eliminada con éxito."});
});

export {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
