import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {useAuth} from "./context/AuthContext";

// Importaciones de páginas
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
// import DashboardPage from './pages/dashboard/DashboardPage';

// Componente Wrapper para proteger rutas
const ProtectedRoute = ({children}) => {
  const {isAuthenticated} = useAuth();
  // Si no está autenticado, lo redirige al login.
  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Rutas Protegidas (Requieren Login) */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              {/* Reemplazar con el componente real del Dashboard */}
              <div>Dashboard (Bienvenido!)</div>
            </ProtectedRoute>
          }
        />

        {/* Redirigir la raíz al Dashboard si está logueado, o al Login si no lo está */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Ruta 404 simple */}
        <Route path='*' element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
