/**
 * @desc Envuelve las funciones de rutas asíncronas de Express.
 * Captura cualquier exepción (rejeción de promesa) y la pasa al middleware de manejo de errores (next).
 * @param {function} fn - La función de controlador de ruta (req, res, next).
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
