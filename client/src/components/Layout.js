import Sidebar from "./Sidebar";
import {useAuth} from "../auth/AuthContext";
import styles from "./Layout.module.css";

const PRO_BUTTON_CLASSES = "btn btnWarning";

/**
 * Componente de Layout principal para todas las rutas protegidas.
 * Incluye la navegación lateral y el área de contenido.
 */
const Layout = ({children, pageTitle = "Dashboard"}) => {
  const {user} = useAuth();

  return (
    <div className={styles.appLayoutContainer}>
      {/* 1. Barra de Navegación Lateral */}
      <Sidebar />

      {/* 2. Área de Contenido Principal */}
      <main className={styles.mainContent}>
        {/* Encabezado Superior */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <div className={styles.headerActions}>
            {/* Ícono de Perfil/Usuario */}
            <span className={styles.profileName}>
              {user?.username || "Usuario"}
            </span>

            {/* Botón de Actualizar a PRO! */}
            <button className={PRO_BUTTON_CLASSES}>Actualizar a PRO!</button>
          </div>
        </header>

        {/* Contenedor del contenido de la página */}
        <div className={styles.contentArea}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
