const asyncHandler = require("express-async-handler"); // Utilidad para manejar errores asíncronos
const User = require("../models/UserModel");
const generateToken = require("../utils/generateToken");

/**
 * @desc   Registrar un nuevo usuario
 * @route  POST /api/auth/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const {username, email, password} = req.body;

  // 1. Verificar si el usuario ya existe
  const userExists = await User.findOne({email});

  if (userExists) {
    res.status(400);
    throw new Error("El usuario ya existe con ese correo electrónico.");
  }

  // 2. Crear nuevo usuario (la contraseña se hashea en el pre-save hook del modelo)
  const user = await User.create({username, email, password});

  // 3. Responder con datos del usuario y el token
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileConfigured: user.profileConfigured,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Datos de usuario inválidos");
  }
});

/**
 * @desc   Autenticar usuario / Iniciar sesión
 * @route  POST /api/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  // 1. Buscar usuario por email
  const user = await User.findOne({email});

  // 2. Verificar usuario y contraseña
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileConfigured: user.profileConfigured,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error("Email o contraseña inválidos");
  }
});

module.exports = {registerUser, loginUser};
