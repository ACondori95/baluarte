import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import {useAuth} from "./auth/AuthContext";

// Componente que verifica si el usuario puede acceder a una ruta
const ProtectedRoute = ({element: Element, ...rest}) => {
  const {user, loading} = useAuth();

  if (loading) {
    // Puedes mostrar un spinner o pantalla de carga
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Si el usuario está autenticado, pero el perfil no está configurado, forzar la configuración
  if (!user.profileConfigured && rest.path !== "/config") {
    // Excluir la ruta de configuración para evitar bucles de redirección
    return <Navigate to='/config' replace />;
  }

  // Si todo está bien, renderizar el componente
  return <Element />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Registrarse o iniciar sesión */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Ruta de Configuración Inicial */}
        <Route
          path='/config'
          element={
            <ProtectedRoute element={ConfigurationPage} path='/config' />
          }
        />

        {/* Rutas Protegidas */}
        <Route
          path='/dashboard'
          element={<ProtectedRoute element={DashboardPage} />}
        />
        <Route
          path='/transactions'
          element={<ProtectedRoute element={TransactionsPage} />}
        />
        <Route
          path='/categories'
          element={<ProtectedRoute element={CategoriesPage} />}
        />
        <Route
          path='/subscriptions'
          element={<ProtectedRoute element={SubscriptionsPage} />}
        />

        {/* Redirigir la raíz al dashboard (si está logueado) o al login */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Manejo de rutas no encontradas */}
        <Route path='*' element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
