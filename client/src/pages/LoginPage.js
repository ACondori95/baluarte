import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import styles from "./AuthPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {login, user, error: authError} = useAuth(); // Obtener funciones y estado del contexto
  const navigate = useNavigate();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user) {
      // Si ya está logueado, redirigir según si configuró el perfil
      navigate(user.profileConfigured ? "/dashboard" : "/config");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      await login(email, password);
      // La redirección ocurrirá automáticamente por el useEffect
    } catch (error) {
      // El error ya está en authError, pero podemos mostrar un mensaje adicional
      setMessage(authError || "Credenciales inválidas");
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Columna de Marca */}
      <div className={styles.brandColumn}>BALUARTE</div>

      {/* Columna de Contenido */}
      <div className={styles.contentColumn}>
        {/* Contenedor del Formulario */}
        <div className={styles.authContainer}>
          <h2>Iniciar Sesión</h2>
          {message && <p className='error-message'>{message}</p>}

          <form onSubmit={submitHandler}>
            <input
              type='email'
              placeholder='Correo Electrónico'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type='submit'
              disabled={loading}
              className='btn btnPrimary'
              style={{width: "100%", marginTop: "10px"}}>
              {loading ? "Accediendo..." : "Iniciar Sesión"}
            </button>
          </form>

          <p>
            ¿No tenés una cuenta? <Link to='/register'>Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
