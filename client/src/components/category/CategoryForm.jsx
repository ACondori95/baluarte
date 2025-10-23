import {useEffect, useState} from "react";

const CategoryForm = ({initialData, onSubmit, onCancel, buttonText}) => {
  // Inicializa el estado condatos vacíos o con los datos iniciales para edición
  const [formData, setFormData] = useState({name: "", type: "Egreso"});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si hay datos iniciales (edición), los cargamos al montar
  useEffect(() => {
    if (initialData) {
      setFormData({name: initialData.name, type: initialData.type});
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.type) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // Llama a la función onSubmit pasada por la prop (maneja POST o PUT)
      await onSubmit(formData);

      // Limpia el formulario solo si es una creación
      if (!initialData) {
        setFormData({name: "", type: "Egreso"});
      }
    } catch (error) {
      // El error viene del controlador de la página que maneja la API
      const message =
        error.response?.data?.message ||
        "Error desconocido al guardar la categoría.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Nombre:</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Tipo:</label>
        <select
          name='type'
          value={formData.type}
          onChange={handleChange}
          required
          style={styles.input}
          disabled={!!initialData}>
          <option value='Egreso'>Egreso</option>
          <option value='Ingreso'>Ingreso</option>
        </select>

        <div style={styles.actions}>
          <button type='submit' disabled={loading} style={styles.buttonPrimary}>
            {loading ? "Guardando..." : buttonText}
          </button>
          <button
            type='button'
            onClick={onCancel}
            style={styles.buttonSecondary}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "calc(100% - 22px)",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  buttonPrimary: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "10px 15px",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CategoryForm;
