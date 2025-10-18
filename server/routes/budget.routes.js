import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

// Todas las rutas de presupuestos requieren autenticación y protección
// Usamos protect() para asegurar de req.user esté disponible

router.route("/").post(protect, createBudget).get(protect, getBudgets);

router.route("/:id").put(protect, updateBudget).delete(protect, deleteBudget);

export default router;
