import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

// La URL base de nuestro backend
const API_URL = "http://localhost:500/api/auth";

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Proveedor del Contexto (Provider)
export const AuthProvider = ({children}) => {
  // Estado para el usuario autenticado y el estado de carga
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario desde localStorage al iniciar la app (Persistencia)
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Función de Login
  const login = async (email, password) => {
    try {
      setError(null);
      const config = {headers: {"Content-Type": "application/json"}};
      // Llamada al backend: POST /api/auth/login
      const {data} = await axios.post(
        `${API_URL}/login`,
        {email, password},
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data)); // Guardar en localStorage
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error al iniciar sesión"
      );
      throw error;
    }
  };

  // Función de Registro
  const register = async (username, email, password) => {
    try {
      setError(null);
      const config = {headers: {"Content-Type": "application/json"}};
      // Llamada al backend: POST /api/auth/register
      const {data} = await axios.post(
        `${API_URL}/register`,
        {username, email, password},
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data)); // Guardar en localStorage
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error al registrarse."
      );
      throw error;
    }
  };

  // Función de Logout
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    window.location.href = "/login"; // Redirigir al login
  };

  // Función para actualizar los datos del usuario después de la configuración de perfil o pago
  const updateUserConfig = (newConfig) => {
    const updatedUser = {...user, ...newConfig};
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserConfig,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}{" "}
      {/* Solo renderizar si la carga inicial a terminado */}
    </AuthContext.Provider>
  );
};
