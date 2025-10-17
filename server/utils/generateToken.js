import jwt from "jsonwebtoken";

/**
 * @desc Firma un JSON Web Token (JWT) con el ID del usuario.
 * @param {string} id - ID del usuario de MongoDB.
 * @returns {string} El JWT generaro.
 */
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
};

export default generateToken;
