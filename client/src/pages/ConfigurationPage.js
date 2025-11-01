import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import api from "../api"; // Usamos la instancia de Axios con token

const ConfigurationPage = () => {
  const {user, updateUserConfig} = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [currency, setCurrency] = useState("ARS"); // Moneda fija para Plan Base
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirigir si el perfil ya está configurado
  useEffect(() => {
    if (user && user.profileConfigured) {
      navigate("/dashboard", {replace: true});
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (!businessName) {
      setError("Por favor, ingresa el nombre de tu negocio.");
      return;
    }

    try {
      setLoading(true);

      // Llamada al backend: PUT /api/users/profile/config
      const {data} = await api.put("/users/profile/config", {
        businessName,
        mainCurrency: currency,
      });

      // Actualizar el estado global del usuario y localStorage
      // Esto dispara el useEffect y la redirección
      updateUserConfig({
        businessName: data.businessName,
        mainCurrency: data.mainCurrency,
        profileConfigured: data.profileConfigured,
      });

      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al guardar la configuración."
      );
      setLoading(false);
    }
  };

  return (
    <div className='config-container'>
      <h2>👋 ¡Bienvenido/a a Baluarte!</h2>
      <h3>Paso 1: Configura tu Perfil de Negocio</h3>

      {error && <p className='error-message'>{error}</p>}

      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label>Nombre de tu Negocio:</label>
          <input
            type='text'
            placeholder='Ej: Mi Pyme S.A.'
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className='form-group'>
          <label>Moneda Principal:</label>
          {/* Para el Plan Base, solo permitiremos ARS */}
          <input
            type='text'
            value='ARS (Plan Base)'
            disabled
            className='currency-input'
          />
          <input type='hidden' value={currency} />
        </div>

        <button type='submit' disabled={loading}>
          {loading ? "Guardando..." : "Comenzar a usar Baluarte"}
        </button>
      </form>
    </div>
  );
};

export default ConfigurationPage;
