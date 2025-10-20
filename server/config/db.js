const mongoose = require("mongoose");

// Función para conectar a la DB
const connectDB = async () => {
  try {
    // Intentamos conectar usando la URI del archivo .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Conectada: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    // Salir del proceso con fallo
    process.exit(1);
  }
};

module.exports = connectDB;
