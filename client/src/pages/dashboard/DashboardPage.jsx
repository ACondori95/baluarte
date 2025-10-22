import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Header from "../../components/layout/Header";

const DashboardPage = () => {
  // Estado para almacenar los datos de reportes
  const [cashFlow, setCashFlow] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para cargar los datos de la API
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");

    // Usamos Promise.all para hacer las dos peticiones a la vez
    try {
      const [cashFlowRes, expensesRes] = await Promise.all([
        axios.get("/api/reports/cashflow"),
        axios.get("/api/reports/expenses-by-category"),
      ]);

      setCashFlow(cashFlowRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      // El error de red o de autenticación (token expirado) se maneja aquí
      setError(
        "Error al cargar datos. ¿Tu token ha expirado o el servidor está caído?"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]); // Se ejecuta una vez al montar

  // --- Renderizado ---

  if (loading) return <div>Cargando Dashboard...</div>;
  if (error)
    return <div style={{color: "red", textAlign: "center"}}>{error}</div>;

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>Panel de Control Financiero (Dashboard)</h2>

        {/* --- Sección 1: Resumen de Flujo de Caja Mensual --- */}
        <section style={styles.section}>
          <h3>Flijo de Caja Mensual Histórico</h3>
          {cashFlow.length === 0 ? (
            <p>
              Aún no tenés transacciones registradas para calcular el flijo de
              caja.
            </p>
          ) : (
            <div style={styles.grid}>
              {cashFlow.map((item) => (
                <div key={`${item.year}-${item.month}`} style={styles.card}>
                  <h4 style={styles.cardTitle}>
                    {item.month}/{item.year}
                  </h4>
                  <p>
                    Ingresos:{" "}
                    <span style={{color: "green"}}>
                      ARS {item.ingresos.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    Egresos:{" "}
                    <span style={{color: "red"}}>
                      ARS {item.egresos.toFixed(2)}
                    </span>
                  </p>
                  <p style={{fontWeight: "bold"}}>
                    Neto:{" "}
                    <span style={{color: item.neto >= 0 ? "green" : "red"}}>
                      ARS {item.neto.toFixed(2)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Sección 2: Distribución de Gastos --- */}
        <section style={styles.section}>
          <h3>Top Egresos por Categoría</h3>
          {expenses.length === 0 ? (
            <p>
              No hay egresos registrados para calcular la distribución de
              gastot.
            </p>
          ) : (
            <ul>
              {expenses.map((item, index) => (
                <li key={index}>
                  {item.categoryName}: ARS {item.totalSpent.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Futura Sección de Presupuesto vs. Real */}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "40px",
    padding: "15px",
    border: "1px solid #eee",
    borderRadius: "6px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "10px",
    color: "#0056b3",
  },
};

export default DashboardPage;
