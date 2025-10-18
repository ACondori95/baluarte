import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // CONFIGURACIÓN DEL PROXY
  server: {
    // Redirige cualquier solicitud que comience con /api a tu servidor Express
    proxy: {
      "/api": {
        target: "http://localhost:5000", // <-- El puerto donde corre tu backend
        changeOrigin: true, // Necesario para asegurar que el host se cambie
        secure: false, // Deshabilita la verificación SSL para localhost
      },
    },
  },
});
