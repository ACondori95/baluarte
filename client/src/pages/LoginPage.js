import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";

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
    <div className='auth-container'>
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
        <button type='submit' disabled={loading}>
          {loading ? "Accediendo..." : "Iniciar Sesión"}
        </button>
      </form>

      <p>
        ¿No tenés una cuenta? <Link to='/register'>Registrate</Link>
      </p>
    </div>
  );
};

export default LoginPage;
