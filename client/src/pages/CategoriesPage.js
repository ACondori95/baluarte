import {useCallback, useEffect, useState} from "react";
import Layout from "../components/Layout";
import api from "../api";
import currencyFormatter from "../utils/currencyFormatter";
import {useAuth} from "../auth/AuthContext";
import styles from "./CategoriesPage.module.css";

const CategoriesPage = () => {
  const {user} = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el formulario de creación de categoría
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "EGRESO", // Por defecto
    monthlyBudget: 0,
  });

  // Estado para la categoría que se está editando (solo presupuesto en este ejemplo)
  const [editingId, setEditingId] = useState(null);
  const [editingBudget, setEditingBudget] = useState(0);

  // --- 1. CARGA DE DATOS ---

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Llamada al backend: GET /api/categories
      const {data} = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      setError(
        "Error al cargar categorías: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- 2. CREACIÓN DE CATEGORÍA ---

  const handleNewCategoryChange = (e) => {
    const {name, value} = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: name === "monthlyBudget" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newCategory.name || !newCategory.type) {
      setError("El nombre y el tipo son obligatorios.");
      return;
    }

    try {
      // Llamada al backend: POST /api/categories
      const {data: createdCategory} = await api.post(
        "/categories",
        newCategory
      );

      // Añadir la nueva categoría al listado
      setCategories([...categories, createdCategory]);
      // Resetear el formulario
      setNewCategory({name: "", type: "EGRESO", monthlyBudget: 0});
    } catch (error) {
      setError(error.response?.data?.message || "Error al crear la categoría.");
    }
  };

  // --- 3. ACTUALIZACIÓN (PRESUPUESTO) ---

  const handleEditStart = (category) => {
    setEditingId(category._id);
    setEditingBudget(category.monthlyBudget);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleUpdateBudget = async (id) => {
    setError(null);
    try {
      // Llamada al backend: PUT /api/categories/:id
      const {data: updatedCategory} = await api.put(`/categories/${id}`, {
        monthlyBudget: editingBudget,
      });

      // Actualizar el estado con la categoría modificada
      setCategories(
        categories.map((cat) => (cat._id === id ? updatedCategory : cat))
      );
      setEditingId(null); // Terminar la edición
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al actualizar el presupuesto."
      );
    }
  };

  // --- 4. ELIMINACIÓN (SOFT DELETE) ---

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres desactivar la categoría "${name}"? Esto es una eliminación suave.`
      )
    ) {
      try {
        // Llamada al backend: DELETE /api/categories/:id
        await api.delete(`/categories/${id}`);

        // Actualizar el estado, las eliminamos de la lista activa del frontend
        setCategories(categories.filter((cat) => cat._id !== id));
      } catch (error) {
        setError(
          error.response?.data?.message || "Error al eliminar la categoría."
        );
      }
    }
  };

  if (loading) {
    return (
      <Layout pageTitle='Categorías'>
        <p>Cargando categorías...</p>
      </Layout>
    );
  }

  return (
    <Layout pageTitle='Categorías'>
      <header className={styles.categoriesHeader}>
        <h1>Gestión de Categorías y Presupuestos 🏷️</h1>
        <p>
          Define tus categorías y asigna un presupuesto mensual a tus egresos.
        </p>
      </header>

      {error && <p className={styles.errorMessge}>{error}</p>}

      {/* SECCIÓN DE CREACIÓN DE CATEGORÍA */}
      <section className={styles.categoryFormCard}>
        <h2>Crear Nueva Categoría</h2>
        <form onSubmit={handleCreateSubmit} className={styles.categoryForm}>
          <input
            type='text'
            name='name'
            placeholder='Nombre de la Categoría (Ej: Alquiler)'
            value={newCategory.name}
            onChange={handleNewCategoryChange}
            required
          />

          <select
            name='type'
            value={newCategory.type}
            onChange={handleNewCategoryChange}>
            <option value='EGRESO'>EGRESO</option>
            <option value='INGRESO'>INGRESO</option>
          </select>

          <input
            type='number'
            name='monthlyBudget'
            placeholder='Presupuesto Mensual (0 si es ingreso)'
            value={newCategory.monthlyBudget}
            onChange={handleNewCategoryChange}
            disabled={newCategory.type === "INGRESO"} // Deshabilitar presupuesto si es INGRESO
            min='0'
          />

          <button
            type='submit'
            className={`${styles.createButton} btn btnPrimary`}>
            Crear Categoría
          </button>
        </form>
      </section>

      {/* SECCIÓN DE LISTADO Y EDICIÓN */}
      <section className={styles.categoryListSection}>
        <h2>Categorías Activas</h2>
        {categories.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Presupuesto ({user?.mainCurrency})</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className={
                    cat.type === "EGRESO" ? styles.egresoRow : styles.ingresoRow
                  }>
                  <td>{cat.name}</td>
                  <td>{cat.type}</td>
                  <td>
                    {editingId === cat.id ? (
                      <input
                        type='number'
                        value={editingBudget}
                        className={styles.editingBudgetInput}
                        onChange={(e) =>
                          setEditingBudget(parseFloat(e.target.value))
                        }
                        min='0'
                        disabled={cat.type === "INGRESO"}
                      />
                    ) : (
                      currencyFormatter(cat.monthlyBudget)
                    )}
                  </td>
                  <td className={styles.actionButtonsContainer}>
                    {editingId === cat._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateBudget(cat._id)}
                          className={`${styles.btnSave} btn btnSuccess`}>
                          Guardar
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className={`${styles.btnCancel} btn btnSecondary`}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        {cat.type === "EGRESO" && (
                          <button
                            onClick={() => handleEditStart(cat)}
                            className={`${styles.btnEdit} btn btnSecondary`}>
                            Editar
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className={`${styles.btnDelete} btn btnDanger`}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            Aún no tenés categorías definidas. Usá el formulario de arriba para
            comenzar.
          </p>
        )}
      </section>
    </Layout>
  );
};

export default CategoriesPage;
