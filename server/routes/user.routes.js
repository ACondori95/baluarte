import express from "express";
import {loginUser, registerUser} from "../controllers/user.controller.js";

const router = express.Router();

// Ruta de Registro: POST /api/users/register
router.post("/register", registerUser);

// Ruta de Login: POST /api/users/login
router.post("/login", loginUser);

export default router;
