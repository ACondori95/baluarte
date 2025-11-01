/**
 * Formatea un número como moneda ARS.
 * @param {number} amount - El monto a formatear.
 * @returns {string} El monto formateado (ej: "$ 1.234,56")
 */
const currencyFormatter = (amount) => {
  if (typeof amount !== "number") {
    amount = 0; // Asegurar que sea un número si hay errores
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default currencyFormatter;
