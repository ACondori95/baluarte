// client/src/pages/SubscriptionsPage.js
import {useEffect, useState} from "react";
import Layout from "../components/Layout";
import api from "../api";
import {useAuth} from "../auth/AuthContext";
import currencyFormatter from "../utils/currencyFormatter";
import {initMercadoPago} from "@mercadopago/sdk-react";
import styles from "./SubscriptionsPage.module.css";

// Se mantiene el valor anterior como fallback por si no existe la variable de entorno.
const PUBLIC_KEY =
  process.env.REACT_APP_MP_PUBLIC_KEY ||
  "TEST-99f60ab4-e5db-412b-89b2-cd223adcdbfb";

if (PUBLIC_KEY) {
  initMercadoPago(PUBLIC_KEY, {locale: "es-AR"});
}

// Definición de los planes para el frontend
const PRO_PLAN = {
  name: "Plan PRO",
  price: 500,
  features: [
    "Transacciones ilimitadas",
    "Hasta 5 usuarios (colaboradores)",
    "Reportes avanzados",
    "Soporte prioritario",
  ],
};

const BASE_PLAN = {
  name: "Plan Base",
  price: 0,
  features: [
    "Hasta 50 transacciones/mes",
    "1 único usuario administrador",
    "Reporte de Flujo de Caja",
    "Soporte estándas",
  ],
};

const SubscriptionsPage = () => {
  const {user, updateUserConfig} = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Función para iniciar el proceso de pago (Mercado Pago)

  const handleUpgradeToPro = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (user.role === "pro") {
      setError("¡Ya sos usuario PRO! Gracias por tu suscripción.");
      setLoading(false);
      return;
    }

    try {
      // Llamada al backend: POST /api/payment/create-preference
      const {data} = await api.post("/mercadopago/create-preference", {
        plan: "pro",
        price: PRO_PLAN.price,
      });

      setLoading(false); // Redirigir al usuario al Checkout de Mercado Pago

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError("No se pudo generar el enlace de pago.");
      }
    } catch (error) {
      // 🚨 CAMBIO APLICADO: Mostrará el mensaje explícito del error 403 del backend.
      setError(
        error.response?.data?.message ||
          "Error al conectar con el servicio de pago."
      );
      setLoading(false);
    }
  }; // Efecto para procesar el retorno de Mercado Pago

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const externalReference = urlParams.get("external_reference"); // user_id

    if (status === "approved" && externalReference === user._id) {
      setSuccessMessage(
        "🎉 ¡Pago aprobado! Tu cuenta se está actualizando a Plan PRO..."
      ); // Simulación de actualización de estado instantánea

      updateUserConfig({role: "pro"}); // Limpiar los parámetros de la URL para evitar reejecuciones

      window.history.replaceState(null, null, window.location.pathname);
    } else if (status === "pending" || status === "in_process") {
      setSuccessMessage(
        "El pago está en proceso. Tu plan se actualizará automáticamente al ser aprobado."
      );
      window.history.replaceState(null, null, window.location.pathname);
    } else if (status === "rejected") {
      setError("El pago fue rechazado. Por favor, inténtalo de nuevo.");
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [user._id, updateUserConfig]);

  const currentPlan = user.role === "pro" ? PRO_PLAN : BASE_PLAN;
  const isPro = user.role === "pro";

  return (
    <Layout pageTitle='Planes'>
      <header className={styles.subscriptionsHeader}>
        <h1>Planes y Suscripciones ✨</h1>
        <p>Tu Plan actual es: **{currentPlan.name}**</p>
      </header>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      <div className={styles.plansContainer}>
        {/* PLAN BASE */}
        <div
          className={`${styles.planCard} ${!isPro ? styles.currentPlan : ""}`}>
          <h2>{BASE_PLAN.name}</h2>
          <p className={styles.price}>Gratis</p>
          <ul className={styles.featuresList}>
            {BASE_PLAN.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <button className={`${styles.btnCurrent} btn btnSecondary`} disabled>
            Plan Actual
          </button>
        </div>

        {/* PLAN PRO */}
        <div
          className={`${styles.planCard} ${isPro ? styles.currentPlan : ""}`}>
          <h2>{PRO_PLAN.name}</h2>
          <p className={styles.price}>{currencyFormatter(PRO_PLAN.price)}</p>
          <ul className={styles.featuresList}>
            {PRO_PLAN.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <button
            onClick={handleUpgradeToPro}
            disabled={isPro || loading}
            className={`${styles.btnUpgrade} btn btnSuccess`}>
            {isPro
              ? "Activado"
              : loading
              ? "Redirigiendo..."
              : "Actualizar a PRO"}
          </button>
        </div>
      </div>

      {/* NOTA sobre Webhooks y la URL de Notificación */}
      <blockquote className={styles.mpNote}>
        **Nota:** Una vez que inicies el pago, serás redirigido a Mercado Pago.
      </blockquote>
    </Layout>
  );
};

export default SubscriptionsPage;
