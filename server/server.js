// Importar dependencias
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const mpRoutes = require("./routes/mpRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const {notFound, errorHandler} = require("./middleware/errorMiddleware");

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Permite a Express parsear JSON en el cuerpo de las peticiones

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Salir del proceso con fallo
  }
};

// Conectar a la base de datos
connectDB();

// Rutas de prueba (Endpoint de bienvenida)
app.get("/", (req, res) => {
  res.send("API de Baluarte en ejecución...");
});

// Usar Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/mercadopago", mpRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Definir Puerto
const PORT = process.env.PORT || 5000;

// Iniciar Servidor
app.listen(
  PORT,
  console.log(
    `Servidor ejecutándose en modo ${process.env.NODE_ENV} en el puerto ${PORT}`
  )
);
