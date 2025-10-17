import express from "express";
import {loginUser, registerUser} from "../controllers/user.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

// Ruta de Registro: POST /api/users/register
router.post("/register", registerUser);
router.post("/login", loginUser);

// Ruta Protegida (Requiere el middleware 'protect')
router.get("/profile", protect, (req, res) => {
  // Si llegamos aquí, el token es válido y req.user contiene los datos del usuario.
  res.json({
    _id: req.user._id,
    businessName: req.user.businessName,
    email: req.user.email,
    plan: req.user.plan,
    message: "¡Acceso concedido al perfil!",
  });
});

export default router;
