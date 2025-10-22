const express = require("express");
const router = express.Router();
const {
  updateSubscriptionPlan,
  getSubscriptionStatus,
} = require("../controllers/subscriptionController");
const {protect} = require("../middleware/authMiddleware");

// Rutas protegidas para gestionar el estado de la suscripción
router.route("/update-plan").put(protect, updateSubscriptionPlan);
router.route("/status").get(protect, getSubscriptionStatus);

module.exports = router;
