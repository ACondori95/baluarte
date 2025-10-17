import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import {BadRequestException, UnauthorizedException} from "../utils/appError.js";
import generateToken from "../utils/generateToken.js";

/**
 * @route POST /api/users/register
 * @desc Registra un nuevo usuario/PyME.
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const {businessName, email, password} = req.body;

  // 1. Validar que todos los campos requridos estén presentes
  if (!businessName || !email || !password) {
    throw new BadRequestException("Por favor, complete todos los campos.");
  }

  // 2. Verificar si el usuario ya existe
  const userExists = await User.findOne({email});

  if (userExists) {
    throw new BadRequestException("El usuario con este email ya existe.");
  }

  // 3. Crear el nuevo usuario (Mongoose middleware hashea la contraseña)
  const user = await User.create({businessName, email, password});

  if (user) {
    // 4. Respuesta de éxito
    res.status(201).json({
      _id: user._id,
      businessName: user.businessName,
      email: user.email,
      plan: user.plan,
      token: generateToken(user._id),
    });
  } else {
    throw new BadRequestException("Datos del usuario no válidos");
  }
});

/**
 * @route POST /api/users/login
 * @desc Autentica un usuario y obtiene el token.
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  // 1. Encontrar usuario por email y seleccionar la contraseña
  const user = await User.findOne({email}).select("+password");

  // 2. Verificar usuario y contraseña (usando el método matchPassword del modelo)
  if (user && (await user.mathchPassword(password))) {
    // 3. Respuesta de éxito
    res.json({
      _id: user._id,
      businessName: user.businessName,
      email: user.email,
      plan: user.plan,
      token: generateToken(user._id),
    });
  } else {
    throw new UnauthorizedException(
      "Credenciales inválidos (email o contraseña incorrectos)."
    );
  }
});

export {registerUser, loginUser};
