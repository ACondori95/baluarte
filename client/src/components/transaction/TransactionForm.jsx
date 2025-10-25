import {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

// Prop: onTransactionCreated se llama después de POST exitoso para refrescar la lista
const TransactionForm = ({onTransactionCreated}) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    description: "",
    // Establecer la fecha predeterminada a hoy
    date: new Date().toISOString().substring(0, 10),
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Cargar Categorías ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Endpoint que ya funciona: GET /api/categories
        const res = await axios.get("/api/categories");
        setCategories(res.data);
        // Si hay categorías, preseleccionar la primera
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: res.data[0]._id,
          }));
        }
      } catch (err) {
        setError(
          "Error al cargar las categorías. Asegúrate de tener al menos una creada."
        );
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación de campos
    if (!formData.categoryId || !formData.amount || !formData.date) {
      setError("Categoría, Monto y Fecha son obligatorios.");
      setLoading(false);
      return;
    }

    const transactionData = {
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
    };

    try {
      // Endpoint POST /api/transactions
      await axios.post("/api/transactions", transactionData);
      alert("Transacción registrada con éxito.");

      // Limpiar formulario y llamar al callback para refrescar la lista
      setFormData({
        categoryId: categories.length > 0 ? categories[0]._id : "",
        amount: "",
        description: "",
        date: new Date().toISOString().substring(0, 10),
      });
      onTransactionCreated();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Error desconocido al registrar la transacción.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3>Registrar Nueva Transacción</h3>

      {error && <p style={styles.error}>{error}</p>}

      {categories.length === 0 ? (
        <p style={styles.warning}>
          No puedes registrar transacciones. Por favor,{" "}
          <Link to='/categories'>crea categorías primero</Link>.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Categoría:</label>
          <select
            name='categoryId'
            value={formData.categoryId}
            onChange={handleChange}
            required
            style={styles.input}>
            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
                style={{color: cat.type === "Egreso" ? "red" : "green"}}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>

          <label style={styles.label}>Monto (ARS):</label>
          <input
            type='number'
            name='amount'
            value={formData.amount}
            onChange={handleChange}
            required
            min='0.01'
            step='0.01'
            style={styles.input}
          />

          <label style={styles.label}>Fecha:</label>
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Descripción (Opcional):</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows='3'
            style={styles.input}
          />

          <button type='submit' disabled={loading} style={styles.buttonPrimary}>
            {loading ? "Registrando..." : "Guardar Transacción"}
          </button>
        </form>
      )}
    </div>
  );
};

const styles = {
  formContainer: {
    padding: "20px",
    border: "1px solid #0056b3",
    borderRadius: "8px",
    backgroundColor: "#f0f4ff",
    marginBottom: "30px",
  },
  warning: {
    color: "#ff9800",
    fontWeight: "bold",
    textAlign: "center",
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
  buttonPrimary: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
};

export default TransactionForm;
