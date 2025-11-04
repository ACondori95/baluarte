const asyncHandler = require("express-async-handler");
const {MercadoPagoConfig, Preference} = require("mercadopago");
const User = require("../models/UserModel");

// Inicializar el cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-5166685588920907-110316-69580838a5ab17bc3608a94659243dc8-2964966678",
  options: {timeout: 5000},
});

/**
 * @desc   Crear preferencia de pago para el Plan PRO
 * @route  POST /api/mercadopago/create-preference
 * @access Private
 */
const createPaymentPreference = asyncHandler(async (req, res) => {
  const user = req.user; // Usuario adjunto por el middleware 'protect'

  // 1. Verificar si el usuario ya es PRO
  if (user.role === "pro") {
    res.status(400);
    throw new Error("El usuario ya tiene el Plan PRO activo.");
  }

  const unitPrice = parseFloat(process.env.MP_PLAN_PRO_PRICE);
  if (isNaN(unitPrice) || unitPrice <= 0) {
    console.error("MP_PLAN_PRO_PRICE es inválido. Revise el .env del backend.");
    res.status(500);
    throw new Error(
      "El precio del plan no está configurado correctamente en el servidor."
    );
  }

  // 2. Creación del objeto de preferencia
  const preferenceBody = {
    items: [
      {
        id: "PLAN-PRO-BALUARTE",
        title: "Suscripción Plan PRO Baluarte - Mensual",
        quantity: 1,
        unit_price: unitPrice, // Usamos la variable validada
        currency_id: "ARS",
      },
    ], // Redirecciones (Deben ser URLs absolutas)
    back_urls: {
      success: "http://localhost:3000/subscriptions?status=success",
      failure: process.env.MP_FAILURE_URL,
      pending: process.env.MP_FAILURE_URL,
    },

    external_reference: user._id.toString(), // Configuración para el Webhook

    notification_url: process.env.MP_NOTIFICATION_URL,
  };

  const preference = new Preference(client);

  try {
    const result = await preference.create({body: preferenceBody}); // Devolver el ID de la preferencia y el punto de inicio para la redirección

    res.json({
      preferenceId: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    const mpErrorMessage =
      error.message || "Error desconocido en Mercado Pago.";

    if (error.status === 403) {
      console.error(
        "Error 403 de MP - Credenciales inválidas:",
        mpErrorMessage
      );
      res.status(403);
      // Devolvemos el mensaje de error para que el frontend lo muestre
      throw new Error(
        "Autorización fallida con Mercado Pago. **REVISA EL ACCESS TOKEN (MP_ACCESS_TOKEN)** en el .env del backend."
      );
    }

    console.error("Error al crear la preferencia de pago (Otros):", error);
    res
      .status(500)
      .json({message: "Error interno del servidor al procesar el pago."});
  }
});

/**
 * @desc   Webhook de Notificación de Mercado Pago
 * @route  POST /api/mercadopago/webhook
 * @access Public (Llamado por Mercado Pago)
 */
const handleMPWebhook = asyncHandler(async (req, res) => {
  // 1. Obtener los datos de la notificación
  const {query} = req;
  const topic = query.topic || query.type; // Puede ser 'payment' o 'merchant_order'

  // Solo procesamos notificaciones de tipo 'payment'
  if (topic !== "payment") {
    return res.status(200).send("Notificación no es de pago, ignorada.");
  }

  const paymentId = query.id || query["data.id"];

  if (!paymentId) {
    return res.status(400).send("ID de pago no encontrado.");
  }

  // 2. Consultar el estado del pago (Seguridad)
  // Nota: En este punto, necesitarías otra instancia de API (ej: Payment) para consultar el ID.
  // Por simplicidad, asumiremos que la notificación es confiable para el estado.
  // En producción, SIEMPRE se debe consultar la API de MP para verificar.

  // Lógica simplificada:
  // Aquí debería haber una consulta real a la API de Payment de MP.

  // Mock de la consulta y obtención de external_reference (ID de usuario)
  // Supongamos que ya validamos el pago y obtuvimos la referencia:

  // **PENDIENTE DE REEMPLAZO** (Por simplicidad en el desarrollo)
  const externalReference = "USER_ID_MOCK"; // Debería venir de la consulta al pago

  // 3. Obtener el ID de usuario desde la external_reference (simulado)
  // Tendrías que almacenar el ID en algún lado o consultarlo. Para pagos aprobados
  // la API te devuelve la external_reference que definimos arriba (`user._id.toString()`).

  // **Usando una consulta simulada a la DB con fines de ejemplo:**
  // En un flujo real, obtienes la External Reference del objeto 'Payment' consultado.
  const userId = externalReference;

  const user = await User.findById(userId);

  if (!user) {
    console.error("Webhook: Usuario no encontrado:", userId);
    return res.status(404).send("Usuario no encontrado.");
  }

  // 4. Actualizar el rol del usuario si el pago es 'aprobado'
  // En un flujo real, verificas el status del pago con la API de MP.
  const paymentStatus = "approved"; // <--- Este status viene de la consulta

  if (paymentStatus === "approved" && user.role !== "pro") {
    user.role = "pro";
    await user.save();
    console.log(`Webhook: Usuario ${user._id} actualizado a PRO.`);
  }

  // 5. Responder con 200 OK
  res.status(200).send("Notificación procesada.");
});

module.exports = {createPaymentPreference, handleMPWebhook};
