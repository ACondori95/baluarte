import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

const RegisterPage = () => {
  // Usamos la función de registro
  const {register} = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({name: "", email: "", password: ""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación básica de campos vacíos
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      // Llamada a la función de registro
      await register(formData);

      // Si el registro es exitoso (también inicia sesión), navegamos al dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Baluarte: Registro PyME 🇦🇷</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label} htmlFor='name'>
          Nombre de la PyME
        </label>
        <input
          type='text'
          name='name'
          id='name'
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

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
          {loading ? "Registrando..." : "Registrar Cuenta"}
        </button>
      </form>

      <p style={styles.footer}>
        ¿Ya tenés cuenta?{" "}
        <Link to='/login' style={styles.link}>
          Iniciá sesión aquí
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

export default RegisterPage;
