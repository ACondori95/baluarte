/**
 * @desc Clase base para todos los errores controlados de la aplicación.
 * @param {string} message - Mensaje de error legible para el usuario.
 * @param {number} statusCode - Código de estado HTTP (ej: 400, 401, 404)
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Captura la pila de llamadas para que el stack trace sea más limpio
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request: Usado para la validación de datos de entrada o errores de negocio.
export class BadRequestException extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// 401 Unauthorized: Usado para credenciales inválidas o token faltante/expirado.
export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access") {
    super(message, 401);
  }
}

// 404 Not Found: Usado cuando un recurso no existe.
export class NotFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
