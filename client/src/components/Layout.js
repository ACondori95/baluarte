import Sidebar from "./Sidebar";

/**
 * Componente de Layout principal para todas las rutas protegidas.
 * Incluye la navegación lateral y el área de contenido.
 */
const Layout = ({children}) => {
  return (
    <div className='app-layout-container'>
      {/* 1. Barra de Navegación Lateral */}
      <Sidebar />

      {/* 2. Área de Contenido Principal */}
      <main className='main-content'>{children}</main>
    </div>
  );
};

export default Layout;
