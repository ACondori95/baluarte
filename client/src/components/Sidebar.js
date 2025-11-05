import {NavLink} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const {user, logout} = useAuth();

  // Lista de enlaces en el menú
  const navItems = [
    {to: "/dashboard", label: "Dashboard"},
    {to: "/transactions", label: "Transacciones"},
    {to: "/categories", label: "Categorías y Presupuestos"},
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {/* Aquí podés usar el businessName configurado */}
        <h3>{user?.businessName || "Baluarte App"}</h3>
      </div>

      <nav className={styles.sidebarNav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({isActive}) =>
                  isActive
                    ? `${styles.navLink} ${styles.activeLink}`
                    : styles.navLink
                }>
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* Enlace de Suscripción/Monetización */}
          <li>
            <NavLink
              to='/subscriptions'
              className={({isActive}) =>
                isActive
                  ? `${styles.navLink} ${styles.activeLink}`
                  : styles.navLink
              }
              style={{fontWeight: user?.role === "base" ? "bold" : "normal"}}>
              Planes y Suscripciones
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <p>Usuario: {user?.username}</p>
        <button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
