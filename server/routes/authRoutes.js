const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/authController");

// Ruta de Registro: POST /api/auth/register
router.post("/register", registerUser);

// Ruta de Login: POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
