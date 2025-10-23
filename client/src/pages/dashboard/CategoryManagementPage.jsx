import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import CategoryForm from "../../components/category/CategoryForm";

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // --- Lógica de API (Fetch, Create, Update, Delete) ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al cargar las categorías."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing) {
        // Lógica de ACTUALIZACIÓN (PUT)
        await axios.put(`/api/categories/${currentCategory._id}`, formData);
        alert("Categoría actualizada con éxito.");
        setIsEditing(false);
        setCurrentCategory(null);
      } else {
        // Lógica de CREACIÓN (POST)
        await axios.post("/api/categories", formData);
        alert("Categoría creada con éxito.");
      }
      fetchCategories(); // Refrescar la lista
    } catch (err) {
      throw err; // El error se maneja en el CategoryForm.jsx
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    // Desplazar la vista al formulario
    window.scrollTo(0, 0);
  };

  const handleDelete = async (categoryId) => {
    if (
      window.confirm(
        "¿Estás seguro de que querés eliminar esta categoría? Esta acción es irreversible"
      )
    ) {
      try {
        await axios.delete(`/api/categories/${categoryId}`);
        alert("Categoría eliminada con éxito.");
        fetchCategories();
      } catch (error) {
        setError(
          error.response?.data?.message || "Error al eliminar la categoría."
        );
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCategory(null);
  };

  // --- Montaje ---
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Renderizado ---
  if (loading) return <div>Cargando categorías...</div>;

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>
          {isEditing ? "Edutar Categoría" : "Crear Nueva Categoría"}
        </h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* Formulario de Creación/Edición */}
        <CategoryForm
          initialData={currentCategory}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          buttonText={isEditing ? "Guardar Cambios" : "Crear Categoría"}
        />

        <h2 style={styles.title}>Listas de Categorías ({categories.length})</h2>

        {/* Listas de Categorías */}
        {categories.length === 0 ? (
          <p>Aún no has creado categorías.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  style={{
                    backgroundColor:
                      cat.type === "Ingreso" ? "#e6ffe6" : "#fff0f0",
                  }}>
                  <td style={styles.td}>{cat.name}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: cat.type === "Ingreso" ? "green" : "red",
                      }}>
                      {cat.type}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(cat)}
                      style={styles.actionButtonEdit}>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      style={styles.actionButtonDelete}>
                      Eliminar
                    </button>
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
    maxWidth: "900px",
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
  actionButtonEdit: {
    padding: "6px 10px",
    marginRight: "10px",
    backgroundColor: "#ffc107",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
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

export default CategoryManagementPage;
