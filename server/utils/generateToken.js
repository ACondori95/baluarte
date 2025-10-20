const jwt = require("jsonwebtoken");

// Función para generar el token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
};

module.exports = generateToken;
