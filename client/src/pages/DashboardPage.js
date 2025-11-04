import {useCallback, useEffect, useState} from "react";
import Layout from "../components/Layout";
import api from "../api";
import {useAuth} from "../auth/AuthContext";
import currencyFormatter from "../utils/currencyFormatter";
import {Link} from "react-router-dom";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const {user} = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Llamada al backend: GET /api/dashboard
      const {data: dashboardData} = await api.get("/dashboard");
      setData(dashboardData);
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error al cargar los datos del dashboard."
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Layout>
        <p>Cargando datos del Dashboard...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h1 className={styles.errorMessage}>Error</h1>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Reintentar</button>
      </Layout>
    );
  }

  const {balance, recentTransactions, budgetVsExpense, planInfo} = data;

  return (
    <Layout
      pageTitle={`Dashboard Mensual: ${new Date().toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
      })}`}>
      <header className={styles.dashboardHeader}>
        <h1>Dashboard Principal de {user?.username}</h1>
        <p>Resumen de tu gestión financiera para el mes actual.</p>
      </header>

      {/* 1. Alerta de Límite de Transacciones */}
      {planInfo.isBasePlan && planInfo.currentCount >= 40 && (
        <div className={styles.alertLimit}>
          ⚠️ **Atención:** Has registrado {planInfo.currentCount} de{" "}
          {planInfo.limit} transacicones este mes. ¡Actualizá a **Plan PRO**
          para continuar sin límites!
          <Link to='/subscriptions' className={styles.btnProAlert}>
            Actualizar a PRO
          </Link>
        </div>
      )}

      {/* 2. Resumen de Flojo de Caja */}
      <section className={styles.dashboardSection}>
        <h2>Flujo de Caja Mensual</h2>
        <div className={styles.summaryCards}>
          <div className={`${styles.card} ${styles.incomeCard}`}>
            <h4>Ingresos Totales</h4>
            <span>{currencyFormatter(balance.totalIngresos)}</span>
          </div>
          <div className={`${styles.card} ${styles.expenseCard}`}>
            <h4>Egresos Totales</h4>
            <span>{currencyFormatter(balance.totalEgresos)}</span>
          </div>
          <div className={`${styles.card} ${styles.balanceCard}`}>
            <h4>Balance Neto</h4>
            <span
              style={{color: balance.currentBalance >= 0 ? "green" : "red"}}>
              {currencyFormatter(balance.currentBalance)}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Presupuesto vs. Gasto (Solo si hay presupuestos definidos) */}
      {budgetVsExpense.length > 0 && (
        <section className={styles.dashboardSection}>
          <h2>Presupuesto vs. Gasto (Egresos)</h2>
          <table className={styles.budgetTable}>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Presupuesto</th>
                <th>Gastado</th>
                <th>Restante</th>
              </tr>
            </thead>
            <tbody>
              {budgetVsExpense.map((item) => (
                <tr key={item.categoryName}>
                  <td>{item.categoryName}</td>
                  <td>{currencyFormatter(item.monthlyBudget)}</td>
                  <td>{currencyFormatter(item.spent)}</td>
                  <td style={{color: item.remaining < 0 ? "red" : "green"}}>
                    {currencyFormatter(item.remaining)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.smallLink}>
            <Link to='/categories'>Gestionar Presupuestos</Link>
          </p>
        </section>
      )}

      {/* 4. Transacciones Recientes */}
      <section className={styles.dashboardSection}>
        <h2>Transacciones Recientes</h2>
        {recentTransactions.length > 0 ? (
          <table className={styles.txnTable}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr
                  key={txn._id}
                  className={
                    txn.type === "EGRESO" ? styles.egresoRow : styles.ingresoRow
                  }>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.description}</td>
                  <td>{txn.category.name}</td>
                  <td>{currencyFormatter(txn.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            No hay transacciones recientes. ¡
            <Link to='/transactions'>Registrá una ahora</Link>!
          </p>
        )}
      </section>
    </Layout>
  );
};

export default DashboardPage;
