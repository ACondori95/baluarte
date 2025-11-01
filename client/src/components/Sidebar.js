import {NavLink} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";

const Sidebar = () => {
  const {user, logout} = useAuth();

  // Lista de enlaces en el menú
  const navItems = [
    {to: "/dashboard", label: "Dashboard"},
    {to: "/transactions", label: "Transacciones"},
    {to: "/categories", label: "Categorías y Presupuestos"},
  ];

  return (
    <div className='sidebar'>
      <div className='sidebar-header'>
        {/* Aquí podés usar el businessName configurado */}
        <h3>{user?.businessName || "Baluarte App"}</h3>
      </div>

      <nav className='sidebar-nav'>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({isActive}) => (isActive ? "active-link" : "")}>
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* Enlace de Suscripción/Monetización */}
          <li>
            <NavLink
              to='/subscriptions'
              className={({isActive}) => (isActive ? "active-link" : "")}
              style={{fontWeight: user?.role === "base" ? "bold" : "normal"}}>
              Plan {user?.role === "pro" ? "PRO" : "Base"}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className='sidebar-footer'>
        <p>Usuario: {user?.username}</p>
        <button onClick={logout} className='logout-button'>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
