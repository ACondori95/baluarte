const express = require("express");
const router = express.Router();
const {registerUser, authUser} = require("../controllers/authController");

// Ruta POST para registrar (Crear un nuevo usuario)
router.post("/register", registerUser);

// Ruta POST para login (Obtener el token de autenticación)
router.post("/login", authUser);

module.exports = router;
