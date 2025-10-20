const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * @desc   Registrar un nuevo usuario
 * @route  POST /api/auth/register
 * @access Público
 */
const registerUser = async (req, res) => {
  const {name, email, password} = req.body;

  // 1. Verificar si el usuario ya existe
  const userExists = await User.findOne({email});

  if (userExists) {
    // Código de respuesta 400: Bad Request
    return res
      .status(400)
      .json({message: "El usuario ya existe en este correo."});
  }

  // 2. Crear el usuario (el middleware pre-save hasheará la contraseña)
  const user = await User.create({name, email, password});

  if (user) {
    // Código de respuesta 201: Created
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      // 3. Generar y devolver el token para el inicio de sesión automático
      token: generateToken(user._id),
    });
  }
};

/**
 * @desc   Autenticar usuario y obtener token
 * @route  POST /api/auth/login
 * @access Público
 */
const authUser = async (req, res) => {
  const {email, password} = req.body;

  // 1. Encontrar el usuario por email
  const user = await User.findOne({email});

  // 2. Verificar el usuario y la contraseña (usando el método creado en el modelo)
  if (user && (await user.matchPassword(password))) {
    // Éxito: Devolver datos del usuario y un nuevo token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      token: generateToken(user._id),
    });
  } else {
    // Código de respuesta 401: Unauthorized
    res
      .status(401)
      .json({message: "Credenciales inválidas (email o contraseña)."});
  }
};

module.exports = {registerUser, authUser};
