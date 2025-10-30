const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// Todas estas rutas necesitan autenticación
router
  .route("/")
  .get(protect, getTransactions) // GET /api/transactions
  .post(protect, createTransaction); // POST /api/transactions (Incluye la validación de límite)

router.route("/:id").delete(protect, deleteTransaction); // DELETE /api/transactions/:id

module.exports = router;
