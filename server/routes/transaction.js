const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const {protect} = require("../middleware/authMiddleware");

// Rutas para OBTENER TODAS y CREAR (POST)
router
  .route("/")
  .get(protect, getTransactions) // Listar todas las transacciones del usuario
  .post(protect, createTransaction); // Registrar una nueva transacción

// Ruta para ELIMINAR por ID
router.route("/:id").delete(protect, deleteTransaction);

module.exports = router;
