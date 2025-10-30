const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

/**
 * Middleware para proteger rutas, asegurando que solo usuarios autenticados accedan.
 * Busca un token JWT en el header 'Authorization', lo decodifico y adjunta el usuario a la request
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Verificar si el token está presente en el header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Obtener el token (quitar 'Bearer ')
      token = req.headers.authorization.split(" ")[1];

      // 3. Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Buscar el usuario por ID y adjuntarlo a la request (excluir la contraseña)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Usuario no encontrado");
      }

      next(); // El usuario está autenticado, continuar con la ruta
    } catch (error) {
      console.error(error);
      res.status(401); // 401 Unauthorized
      throw new Error("Token fallido o expirado");
    }
  }

  // Si no hay token
  if (!token) {
    res.status(401);
    throw new Error("No autorizado, no hay token");
  }
});

module.exports = {protect};
