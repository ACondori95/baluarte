import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();

// Todas las rutas de transacciones requieren autenticación
// Usamos protect() para asegurar que req.user esté disponible

router
  .route("/")
  .post(protect, createTransaction) // POST /api/transactions: Crea una nueva transacción
  .get(protect, getTransactions); // GET /api/transactions: Obtiene todas las transacciones

router
  .route("/:id")
  .put(protect, updateTransaction) // PUT /api/transactions/:id: Actualiza una transacción específica
  .delete(protect, deleteTransaction); // DELETE /api/transactions/:id: Elimina una transacción específica

export default router;
