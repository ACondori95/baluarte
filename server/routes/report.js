const express = require("express");
const router = express.Router();
const {
  getMonthlyCashFlow,
  getExpensesByCategory,
} = require("../controllers/reportController");
const {protect} = require("../middleware/authMiddleware");

// Ruta principal para el Dashboard
router.route("/cashflow").get(protect, getMonthlyCashFlow);
router.route("/expenses-by-category").get(protect, getExpensesByCategory);

module.exports = router;
