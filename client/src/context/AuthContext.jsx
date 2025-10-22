import {createContext, useContext, useEffect, useReducer} from "react";
import axios from "axios";

// Estado inicial: Intenta cargar el usuario y el token desde localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
};

// Reducer para manejar cambios de estado
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

// Crear el contexto
export const AuthContext = createContext(initialState);

// Proveedor del Contexto
export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 1. Configurar axios para usar el token automáticamente en cada petición
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  // 2. Función de Login
  const login = async (formData) => {
    try {
      const {data} = await axios.post("/api/auth/login", formData);

      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Actualizar estado
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {user: data, token: data.token},
      });
    } catch (error) {
      throw error.response.data.message || "Error de conexión.";
    }
  };

  // 3. Función de Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({type: "LOGOUT"});
  };

  return (
    <AuthContext.Provider
      value={{state, login, logout, isAuthenticated: state.isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar la autenticación fácilmente
export const useAuth = () => useContext(AuthContext);
