import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

const Header = () => {
  const {state, logout} = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Baluarte 🇦🇷</h1>
      <nav style={styles.nav}>
        {state.isAuthenticated ? (
          <>
            <Link to='/dashboard' style={styles.link}>
              Dashboard
            </Link>
            <Link to='/categories' style={styles.link}>
              Categorías
            </Link>
            <span style={styles.userInfo}>
              Hola, {state.user?.name} (Plan: {state.user?.plan})
            </span>
            <button onClick={handleLogout} style={styles.button}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to='/login' style={styles.link}>
            Iniciar Sesión
          </Link>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    passing: "10px 20px",
    backgroundColor: "#0056b3",
    color: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    fontSize: "1.5em",
    margin: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userInfo: {
    fontSize: "0.9em",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
};

export default Header;
