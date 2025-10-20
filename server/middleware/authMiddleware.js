const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware para proteger rutas.
 * Verifica si hay un token válido en el encabezado de la petición.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el encabezado Authorization existe y comienza con 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Obtener el token (quitar 'Bearer ' al inicio)
      token = req.headers.authorization.split(" ")[1];

      // 3. Verificar y decodificar el token
      // Esto nos da el ID de usuario que firmamos en authControlle.js
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Buscar el usuario en la DB por el ID del token
      // .select('-password') excluye la contraseña de la respuesta
      req.user = await User.findById(decoded.id).select("-password");

      // 5. Continuar la siguiente middleware/función del controlador
      next();
    } catch (error) {
      console.error(error);
      // Token inválido o expirado
      return res
        .status(401)
        .json({message: "No autorizado, token fallido o expirado."});
    }
  }

  // Si no hay token en la petición
  if (!token) {
    return res.status(401).json({message: "No autorizado, no hay token."});
  }
};

module.exports = {protect};
