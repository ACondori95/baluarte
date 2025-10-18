import {MercadoPagoConfig, Payment, Preference} from "mercadopago";
import asyncHandler from "../utils/asyncHandler.js";
import {BadRequestException} from "../utils/appError.js";
import User from "../models/User.js";

// Inicializar el cliente de Mercado Pago con la nueva sintaxis
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Crear instancias para interactuar con las APIs de MP
const preferenceService = new Preference(client);
const paymentService = new Payment(client); // Usando para buscar pagos en el webhook

const NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL;

/**
 * @route POST /api/payments/create-subscription
 * @desc Crea una preferencia de pago para la subscripción (ej: Plan Pro)
 * @access Private
 */
const createSubscription = asyncHandler(async (req, res) => {
  const {planType, price, reason} = req.body;
  const user = req.user;

  if (!planType || !price) {
    throw new BadRequestException("Faltan datos del plan: tipo y precio.");
  }

  // Definir en el plan de acuerdo a tu estrategia (ej: Plan Pro ARS 2990)
  const planExternalReference = `${planType}_${user._id}`;

  const preferenceBody = {
    items: [
      {
        title:
          reason || `Subscription ${planType.toUpperCase()} - PyME Baluarte`,
        unit_price: Number(price),
        quantity: 1,
      },
    ],
    payer: {email: user.email},
    notification_url: NOTIFICATION_URL,
    external_reference: planExternalReference,

    back_urls: {
      success: `${process.env.FRONTEND_ORIGIN}/dashboard?payment=success`,
      failure: `${process.env.FRONTEND_ORIGIN}/pricing?payment=failure`,
      pending: `${process.env.FRONTEND_ORIGIN}/pricing?payment=pending`,
    },
    auto_return: "approved",
  };

  try {
    // Usar la instancia preferenceService
    const response = await preferenceService.create({body: preferenceBody});

    res.status(200).json({success: true, initPoint: response.init_point});
  } catch (error) {
    console.error("Error al crear preferencia de MP:", error);
    throw new BadRequestException("Error al procesar el pago en Mercado Pago.");
  }
});

/**
 * @route POST /api/payments/webhook
 * @desc Recibe notificaciones de Mercado Pago sobre el estado de un pago.
 * @access Public (Debe ser accesible por MP)
 */
const handleWebhook = asyncHandler(async (req, res) => {
  // MP envía la ID del recurso por query, usualmente como 'id' o 'data.id'
  const paymentId = req.query.id || req.query["data.id"];
  const topic = req.query.topic;

  // Solo nos interesa el topic 'payment' para el MVP
  if (topic === "payment" && paymentId) {
    try {
      // 1. Obtener detalles completos del pago desde la API de MP usando paymentService
      const payment = await paymentService.get({id: Number(paymentId)});
      const paymentData = payment; // La respuesta es el objeto de datos del pago

      // 2. Obtener la referencia externa (userId)
      const externalReference = paymentData.external_reference;
      const userId = externalReference.split("_")[1];

      // 3. Verificar el estado
      if (paymentData.status === "approved") {
        // 4. Lógica de negocio: Actualizar el plan del usuario en la DB
        const user = await User.findById(userId);
        if (user) {
          const newPlan = externalReference.split("_")[0];
          user.plan = newPlan;
          await user.save();
          console.log(`Usuario ${userId} actualizado al plan ${newPlan}.`);
        }
      }

      // 5. Siempre responder con 200/204 a Mercado Pago
      return res.status(204).send();
    } catch (error) {
      console.error("Error al procesar el webhook de MP:", error);
      return res.status(204).send();
    }
  }

  // Si no es un topic de pago relevante o falta de ID
  res.status(204).send();
});

export {createSubscription, handleWebhook};
