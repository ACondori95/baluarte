import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";

// --- MIDDLEWARES Y RUTAS ---
import userRoutes from "./routes/user.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import {errorHandler} from "./middleware/error.middleware.js";

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
app.use(express.urlencoded({extended: true}));

// ------------------------------------
// DEFINICIÓN DE RUTAS
// ------------------------------------
// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("API de Baluarte funcionando...");
});

// Rutas de Usuario: /api/users/*
app.use("/api/users", userRoutes);

// Rutas de Transacciones: /api/transactions/*
app.use("/api/transactions", transactionRoutes);

// Ritas de Presupuestos: /api/budgets/*
app.use("/api/budgets", budgetRoutes);

// ------------------------------------
// MANEJO DE ERRORES GLOBAL
// ------------------------------------
app.use(errorHandler);

// Inicializar el servidor
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`
  );
});
