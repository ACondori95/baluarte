import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {useAuth} from "./context/AuthContext";

// Importaciones de páginas
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CategoryManagementPage from "./pages/dashboard/CategoryManagementPage";
import TransactionManagementPage from "./pages/dashboard/TransactionManagementPage";

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
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/categories'
          element={
            <ProtectedRoute>
              <CategoryManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/transactions'
          element={
            <ProtectedRoute>
              <TransactionManagementPage />
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
