const User = require("../models/User");

/**
 * @desc   Ruta simulada para actualizar el plan del usuario (por Mercado Pago Webhook o acción del usuario)
 * @route  PUT /api/subscriptions/update-plan
 * @access Privado
 */
const updateSubscriptionPlan = async (req, res) => {
  // Solo permitimos actualizar al plan 'Pro' por ahora (el plan 'Base' es gratuito)
  const {newPlan} = req.body;

  // Validación de planes permitidos
  if (!["Pro", "Premium"].includes(newPlan)) {
    return res.status(400).json({message: "Plan de suscripción no válido"});
  }

  // 1. Obtener el usuario del token
  const user = req.user;

  try {
    // 2. Actualizar el plan del usuario
    user.plan = newPlan;
    await user.save();

    res.json({
      message: `¡Felicitaciones! Tu plan ha sido actualizado a ${newPlan}.`,
      newPlan: user.plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la suscripción.",
      error: error.message,
    });
  }
};

/**
 * @desc   Obtener el estado actual de la suscripción del usuario
 * @route  GET /api/subscriptions/status
 * @access Privado
 */
const getSubscriptionStatus = (req, res) => {
  // Usamos la información ya disponibles en req.user
  res.json({
    plan: req.user.plan,
    status: req.user.plan !== "Base" ? "Active" : "Free Tier",
    message: `Actualmente estás en el plan ${req.user.plan}`,
  });
};

module.exports = {updateSubscriptionPlan, getSubscriptionStatus};
