import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {
  createSubscription,
  handleWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

// 1. Ruta para que el Frotend solicite el link de pago (Protegida)
router.post("/create-subscription", protect, createSubscription);

// 2. Ruta para que Mercado Pago nos notifique (Debe ser pública)
router.post("/webhook", handleWebhook);

export default router;
