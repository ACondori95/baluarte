/**
 * @desc Middleware global para manejar todos los errores.
 * Se define con cuatro parámetros (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  // Determinar el código de estado HTTP: usa el código del error si existe,
  // sino usa 500 (Internal Server Error) o 400.
  const statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode || 500);

  // Si el error viene de un código Mongoose (ej. ID de objeto inválida)
  let message = err.message;
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Recurso no encontrado";
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export {errorHandler};
