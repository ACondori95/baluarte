/**
 * @desc   Obtener el perfil del usuario autenticado
 * @route  GET /api/users/profile
 * @access Privado (Requiere token)
 */
const getUserProfile = (req, res) => {
  // Gracias al middleware 'protect', req.user ya contiene los datos del usuario.
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      plan: req.user.plan,
    });
  } else {
    // Esto no debería pasar si el middleware funciona, pero es buena práctica
    res.status(404).json({message: "Usuario no encontrado."});
  }
};

module.exports = {getUserProfile};
