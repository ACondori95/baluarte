import mongoose from "mongoose";

/**
 * @desc Conecta la aplicación a la base de datos MongoDB
 */
const connectDB = async () => {
  try {
    // La URI se obtiene automáticamente de process.env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión de MongoDB: ${error.message}`);

    // Termina el proceso con un código de fallo (1) si la conexión falla
    process.exit(1);
  }
};

export default connectDB;
