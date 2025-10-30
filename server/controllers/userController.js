const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

/**
 * @desc   Obtener datos del usuario/perfil actual
 * @route  GET /api/users/profile
 * @access Private (Necesita token)
 */
const getUserProfile = asyncHandler(async (req, res) => {
  // El usuario ya fue adjuntado a req.user por el middleware 'protect'
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      businessName: user.businessName,
      mainCurrency: user.mainCurrency,
      role: user.role,
      profileConfigured: user.profileConfigured,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

/**
 * @desc   Configurar/Actualizar el perfil inicial del negocio
 * @route  PUT /api/users/profile/config
 * @access Private
 */
const configureBusinessProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const {businessName, mainCurrency} = req.body;

    // Actualizar campos
    user.businessName = businessName || user.businessName;

    // **Importante:** Solo permitir cambiar a USD si es plan PRO.
    // En este punto, solo permitiremos ARS, o si ya tienen PRO lo manejaremos después.
    // Por ahora, si no se proporciona, mantiene el valor por defecto ('ARS').
    user.mainCurrency = "ARS"; // Forzamos ARS para el Plan Base

    user.profileConfigured = true; // Marcar la configuración como completada

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      businessName: updatedUser.businessName,
      mainCurrency: updatedUser.mainCurrency,
      profileConfigured: updatedUser.profileConfigured,
      message: "Perfil de negocio configurado exitosamente.",
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

module.exports = {getUserProfile, configureBusinessProfile};
