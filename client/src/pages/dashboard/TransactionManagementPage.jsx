import {useState, useEffect, useCallback} from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import TransactionForm from "../../components/transaction/TransactionForm";

const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // Clave para forzar el refresco

  // --- Lógica de API (Fetch y Delete) ---
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Endpoint GET /api/transactions (ya poblado con categoría)
      const res = await axios.get("/api/transactions");
      setTransactions(res.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al cargar las transacciones."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (transactionId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")
    ) {
      try {
        // Endpoint DELETE /api/transactions/:id
        await axios.delete(`/api/transactions/${transactionId}`);
        alert("Transacción eliminada con éxito.");
        // Refrescar lista después de eliminar
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error al eliminar la transacción."
        );
      }
    }
  };

  // Función de callback para refrescar la lista después de la creación
  const handleTransactionCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // --- Montaje y Refresco ---
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshKey]); // Depende del refreshKey

  // --- Renderizado ---
  const formatCurrency = (amount) => `ARS ${parseFloat(amount).toFixed(2)}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-AR");

  if (loading) return <div>Cargando transacciones...</div>;

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>Registro de Transacciones</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* Formulario de Creación */}
        <TransactionForm onTransactionCreated={handleTransactionCreated} />

        <h2 style={styles.title}>
          Historial de Movimientos ({transactions.length})
        </h2>

        {/* Lista de Transacciones */}
        {transactions.length === 0 ? (
          <p>
            No hay transacciones registradas. ¡Empieza a registrar tu flujo de
            caja!
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Monto</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t._id}
                  style={{
                    backgroundColor:
                      t.type === "Ingreso" ? "#e6ffe6" : "#fff0f0",
                  }}>
                  <td style={styles.td}>{formatDate(t.date)}</td>
                  <td style={styles.td}>{t.category.name}</td>
                  <td style={styles.td}>{t.description || "-"}</td>
                  <td style={styles.td}>{formatCurrency(t.amount)}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: t.type === "Ingreso" ? "green" : "red",
                      }}>
                      {t.type}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={styles.actionButtonDelete}>
                      Eliminar
                    </button>
                    {/* (Omitimos Editar para el MVP, como se decidió en el backend) */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    /* ... estilos ... */ padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    /* ... estilos ... */ borderBottom: "2px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "20px",
    marginTop: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
  },
  actionButtonDelete: {
    padding: "6px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default TransactionManagementPage;
