const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {getDashboardData} = require("../controllers/dashboardController");

// Ruta protegida para obtener todos los datos del Dashboard
// GET /api/dashboard
router.route("/").get(protect, getDashboardData);

module.exports = router;
