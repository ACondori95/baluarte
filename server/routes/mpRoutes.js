const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
  createPaymentPreference,
  handleMPWebhook,
} = require("../controllers/mpController");

// Ruta para que el frontend pida el ID de la preferencia
// POST /api/marcadopago/create-preference
router.post("/create-preference", protect, createPaymentPreference);

// Ruta pública (Webhook) a la que Mercado Pago enviará las notificaciones
// POST /api/mercadopago/webhook
router.post("/webhook", handleMPWebhook);

module.exports = router;
