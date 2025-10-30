const jwt = require("jsonwebtoken");

/**
 * Genera un JSON Web Token (JWT) para el ID del usuario.
 * @param {string} id - El ID de MongoDB del usuario.
 * @returns {string} El token generado.
 */
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "30d", // El token expira en 30 días
  });
};

module.exports = generateToken;
