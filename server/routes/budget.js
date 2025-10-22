const express = require("express");
const router = express.Router();
const {
  getBudgets,
  setBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const {protect} = require("../middleware/authMiddleware");

// Rutas para OBTENER TODAS (GET) y CREAR/ACTUALIZAR (POST)
// Usamos POST para setBudget ya que puede crear o actualizar el recurso
router.route("/").get(protect, getBudgets).post(protect, setBudget);

// Ruta para ELIMINAR por ID
router.route("/:id").delete(protect, deleteBudget);

module.exports = router;
