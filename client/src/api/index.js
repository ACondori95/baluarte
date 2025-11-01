import axios from "axios";

// 1. Crear la instancia base de Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Nuestra base URL del backend
  headers: {"Content-Type": "application/json"},
});

// 2. Interceptor para adjuntar el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      // Adjuntar el token en el formato Bearer
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
