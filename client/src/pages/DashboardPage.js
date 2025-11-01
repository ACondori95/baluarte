import {useCallback, useEffect, useState} from "react";
import Layout from "../components/Layout";
import api from "../api";
import {useAuth} from "../auth/AuthContext";
import currencyFormatter from "../utils/currencyFormatter";
import {Link} from "react-router-dom";

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
        <h1 className='error-message'>Error</h1>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Reintentar</button>
      </Layout>
    );
  }

  const {balance, recentTransactions, budgetVsExpense, planInfo} = data;

  return (
    <Layout>
      <header className='dashboard-header'>
        <h1>Dashboard Principal de {user?.businessName}</h1>
        <p>Resumen de tu gestión financiera para el mes actual.</p>
      </header>

      {/* 1. Alerta de Límite de Transacciones */}
      {planInfo.isBasePlan && planInfo.currentCount >= 40 && (
        <div className='alert-limit'>
          ⚠️ **Atención:** Has registrado {planInfo.currentCount} de{" "}
          {planInfo.limit} transacicones este mes. ¡Actualizá a **Plan PRO**
          para continuar sin límites!
          <Link to='/subscriptions' className='btn-pro-alert'>
            Actualizar a PRO
          </Link>
        </div>
      )}
      {/* Mensaje de Límite Alcanzado (Si el contador está completo, lo cual ya se maneja en el POST de transacciones) */}

      {/* 2. Resumen de Flojo de Caja */}
      <section className='dashboard-summary'>
        <h2>Flujo de Caja Mensual</h2>
        <div className='summary-cards'>
          <div className='card income-card'>
            <h4>Ingresos Totales</h4>
            <span>{currencyFormatter(balance.totalIngresos)}</span>
          </div>
          <div className='card expense-card'>
            <h4>Egresos Totales</h4>
            <span>{currencyFormatter(balance.totalEgresos)}</span>
          </div>
          <div className='card balance-card'>
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
        <section className='dashboard-budgets'>
          <h2>Presupuesto vs. Gasto (Egresos)</h2>
          <table>
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
          <p className='small-link'>
            <Link to='/categories'>Gestionar Presupuestos</Link>
          </p>
        </section>
      )}

      {/* 4. Transacciones Recientes */}
      <section className='dashboard-recent-txns'>
        <h2>Transacciones Recientes</h2>
        {recentTransactions.length > 0 ? (
          <table>
            <table className='txn-table'>
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
                      txn.type === "EGRESO" ? "egreso-row" : "ingreso-row"
                    }>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>{txn.description}</td>
                    <td>{txn.category.name}</td>
                    <td>{currencyFormatter(txn.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
