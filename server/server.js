// 1. Importaciones necesarias
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");

// 2. Cargar variables de entorno del archivo .env
dotenv.config();

// 3. Conectar a la Base de Datos
connectDB();

// 4. Inicializar la aplicación Express
const app = express();

// 5. Middleware de Express
// Permite que el servidor acepte datos JSON en el cuerpo de las peticiones
app.use(express.json());

// 6. Rutas
// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Baluarte en funcionamiento!");
});

// Montar las rutas de autenticación en /api/auth
app.use("/api/auth", authRoutes);

// Montar las rutas de usuario (perfil, etc.) en /api/users
app.use("/api/users", userRoutes);

// Montar las rutas de categorías en /api/categories
app.use("/api/categories", categoryRoutes);

// 7. Configurar Puerto y Ejecutar Servidor
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`🚀 Servidor corriendo en modo desarrollo en el puerto ${PORT}`)
);
