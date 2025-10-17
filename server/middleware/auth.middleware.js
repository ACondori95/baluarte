import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import {UnauthorizedException} from "../utils/appError.js";
import User from "../models/User.js";

/**
 * @desc Verifica la autenticación del usuario mediante JWT.
 * Si es exitoso, adjunta el objeto del usuario a req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Buscar el token en los headers (formato: "Bearer <token>")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Obtener el token (quitar "Bearer")
      token = req.headers.authorization.split(" ")[1];

      // 2. Verificar el token usando el secreto del .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Obtener el usuario de la DB basado en la ID del token
      // Se excluye la contraseña para seguridad
      req.user = await User.findById(decoded.id).select("-password");

      // 4. Si encontramos el usuario, continuar con la ruta
      next();
    } catch (error) {
      console.error(error);
      // Si el es inválido o ha expirado
      throw new UnauthorizedException(
        "Acceso no autorizado, token fallido o expirado."
      );
    }
  }

  // 5. Si no hay token en los headers
  if (!token) {
    throw new UnauthorizedException(
      "Acceso no autorizado, no se encontró token."
    );
  }
});

export {protect};
