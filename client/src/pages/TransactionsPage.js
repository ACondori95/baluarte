import {useCallback, useEffect, useState} from "react";
import Layout from "../components/Layout";
import api from "../api";
import currencyFormatter from "../utils/currencyFormatter";
import {useAuth} from "../auth/AuthContext";
import {Link} from "react-router-dom";

const TransactionsPage = () => {
  const {user} = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "EGRESO", // Valor por defecto
    categoryId: "",
    date: new Date().toISOString().substring(0, 10), // Formato YYYY-MM-DD
  });

  // --- 1. CARGA DE DATOS ---

  // Función para cargar categorías
  const fetchCategories = useCallback(async () => {
    try {
      const {data} = await api.get("/categories");
      setCategories(data);
      if (data.length > 0) {
        setForm((prev) => ({...prev, categoryId: data[0]._id})); // Seleccionar la primera categoría por defecto
      }
    } catch (error) {
      setError(
        "Error al cargar categorías: " +
          (error.response?.data?.message || error.message)
      );
    }
  }, []);

  // Función para cargar transacciones
  const fetchTransactions = useCallback(async () => {
    try {
      const {data} = await api.get("/transactions");
      setTransactions(data);
    } catch (error) {
      setError(
        "Error al cargar transacciones: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  // --- 2. MANEJO DEL FORMULARIO ---

  const handleFormChange = (e) => {
    const {name, value} = e.target;

    if (name === "type") {
      const newDefaultCategory = categories
        .filter((cat) => cat.type === value)
        .sort((a, b) => a.name.localeCompare(b.name))[0];

      setForm((prev) => ({
        ...prev,
        [name]: value,
        categoryId: newDefaultCategory ? newDefaultCategory._id : "",
      }));
    } else {
      setForm((prev) => ({...prev, [name]: value}));
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones Básicas
    if (
      !form.amount ||
      !form.description ||
      !form.categoryId ||
      !form.type ||
      !form.date
    ) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Llamada al backend: POST /api/transactions
      const {data: newTransaction} = await api.post("/transactions", {
        ...form,
        amount: parseFloat(form.amount),
        category: form.categoryId, // El backend espera 'category' en lugar de 'categoryId'
      });

      const categoryObject = categories.find(
        (cat) => cat._id === newTransaction.category
      );

      const transactionToShow = {
        ...newTransaction,
        category: categoryObject || {name: "Sin Categoría"},
      };

      // Añadir la nueva transacción al listado y resetear el formulario
      setTransactions([transactionToShow, ...transactions]);
      setForm({
        description: "",
        amount: "",
        type: "EGRESO",
        categoryId: categories[0]?._id || "",
        date: new Date().toISOString().substring(0, 10),
      });
    } catch (error) {
      // Manejo del error de Límite Alcanzado o cualquier otro error
      setError(
        error.response?.data?.message || "Error al registrar la transacción."
      );
    }
  };

  // --- 3. ELIMINACIÓN DE TRANSACCIÓN ---

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que querés eliminar esta transacción?")
    ) {
      try {
        // Llamada al backend: DELETE /api/transactions/:id
        await api.delete(`/transactions/${id}`);

        // Actualizar el estado (filtrar la transacción eliminada)
        setTransactions(transactions.filter((txn) => txn._id !== id));
      } catch (error) {
        setError(
          error.response?.data?.message || "Error al eliminar la transacción."
        );
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Cargando transacciones...</p>
      </Layout>
    );
  }

  const tipoTransaccion = form.type;

  return (
    <Layout>
      <header className='transactions-header'>
        <h1>Registro de Transacciones ✍️</h1>
        <p>Aquí podés registrar tus Ingresos y Egresos diarios.</p>
      </header>

      {error && <p className='error-message'>{error}</p>}

      {/* SECCIÓN DE REGISTRO */}
      <section className='transaction-form-card'>
        <h2>Nueva Transacción</h2>
        <form onSubmit={handleTransactionSubmit} className='transaction-form'>
          {/* Tipo (Ingreso/Egreso) - Podría ser un toggle */}
          <div className='form-group'>
            <label>Tipo de Movimiento:</label>
            <select name='type' value={form.type} onChange={handleFormChange}>
              <option value='EGRESO'>EGRESO</option>
              <option value='INGRESO'>INGRESO</option>
            </select>
          </div>

          {/* Categoría */}
          <div className='form-group'>
            <label>Categoría:</label>
            <select
              name='categoryId'
              value={form.categoryId}
              onChange={handleFormChange}
              required>
              <option value='' disabled>
                Selecciona una categoría
              </option>
              {categories
                // Mostrar solo categorías activas y del tipo seleccionado actualmente
                .filter((cat) => cat.type === form.type)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
            </select>
            {categories.length === 0 && (
              <p className='small-link'>
                Aún no tenés categorías. Andá a{" "}
                <Link to='/categories'>Categorías</Link> para crearlas.
              </p>
            )}
          </div>

          {/* Monto */}
          <div className='form-group'>
            <label>Monto ({user?.mainCurrency}):</label>
            <input
              type='number'
              name='amount'
              step='0.01'
              placeholder='0.00'
              value={form.amount}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Descripción */}
          <div className='form-group'>
            <label>Descripción:</label>
            <input
              type='text'
              name='description'
              placeholder='Ej: Pago de alquiler de oficina'
              value={form.description}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Fecha */}
          <div className='form-group'>
            <label>Fecha:</label>
            <input
              type='date'
              name='date'
              value={form.date}
              onChange={handleFormChange}
              required
            />
          </div>

          <button type='submit' disabled={categories.length === 0}>
            Registrar {tipoTransaccion}
          </button>
        </form>
      </section>

      {/* SECCIÓN DE LISTADO */}
      <section className='transaction-list-section'>
        <h2>Historial de Transacciones</h2>
        {transactions.length > 0 ? (
          <table className='data-table'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn._id}
                  className={
                    txn.type === "EGRESO" ? "egreso-row" : "ingreso-row"
                  }>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.description}</td>
                  <td>{txn.category.name}</td>
                  <td>{txn.type}</td>
                  <td>{currencyFormatter(txn.amount)}</td>
                  <td>
                    {/* Botón de eliminar */}
                    <button
                      onClick={() => handleDelete(txn._id)}
                      className='btn-delete'>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aún no registraste ninguna transacción.</p>
        )}
      </section>
    </Layout>
  );
};

export default TransactionsPage;
