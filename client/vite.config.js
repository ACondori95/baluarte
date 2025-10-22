import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // CONFIGURACIÓN CLAVE DEL PROXY:
  server: {
    // Redirige las peticiones que empiecen por '/api' a tu backend Express
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
