import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

const LoginPage = () => {
  // Usamos el hook useAuth para acceder a la función de login
  const {login} = useAuth();

  // Hook para la navegación
  const navigate = useNavigate();

  // Estado local para los campos del formulario
  const [formData, setFormData] = useState({email: "", password: ""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Llamada a la función de login del AuthContext
      await login(formData);

      // Si el login es exitoso, navegamos al dashboard
      navigate("/dashboard");
    } catch (error) {
      // El error viene del throw que hicimos en el AuthContext
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Baluarte: Acceso PyME 🇦🇷</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label} htmlFor='email'>
          Email
        </label>
        <input
          type='email'
          name='email'
          id='email'
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label} htmlFor='password'>
          Contraseña
        </label>
        <input
          type='password'
          name='password'
          id='password'
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type='submit' disabled={loading} style={styles.button}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>

      <p style={styles.footer}>
        ¿No tenés cuenta?{" "}
        <Link to='/register' style={styles.link}>
          Registrate aquí
        </Link>
      </p>
    </div>
  );
};

// Estilos básicos (serán reemplazados por Tailwind/CSS Modules más adelante)
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#0056b3",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default LoginPage;
