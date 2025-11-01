import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {register, user, error: authError} = useAuth(); // Obtener funciones y estado del contexto
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
      await register(username, email, password);
      // La redirección ocurrirá automáticamente por el useEffect
    } catch (error) {
      // El error ya está en authError, pero podemos mostrar un mensaje adicional si es necesario
      setMessage(authError || "Error al registrar la cuenta.");
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <h2>Crear Cuenta Baluarte</h2>
      {message && <p className='error-message'>{message}</p>}

      <form onSubmit={submitHandler}>
        <input
          type='text'
          placeholder='Nombre de Usuario'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p>
        ¿Ya tenés una cuenta? <Link to='/login'>Iniciar Sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
