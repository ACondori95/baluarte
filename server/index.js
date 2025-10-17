import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";

// Cargar variables de entorno (Debe ir primero)
dotenv.config();

// Inicializar Express y definir puerto
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos (Se ejecuta al iniciar la app)
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ------------------------------------
// RUTAS PRINCIPALES (Placeholder)
// ------------------------------------
app.get("/", (req, res) => {
  res.send("API de Baluarte funcionando...");
});

// Inicializar el servidor
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`
  );
});
