const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {protect} = require("../middleware/authMiddleware"); // Necesario para proteger todas la rutas

// Rutas para OBTENER TODAS y CREAR (POST)
router.route("/").get(protect, getCategories).post(protect, createCategory);

// Rutas para OBTENER por ID, ACTUALIZAR (PUT) y ELIMINAR (DELETE)
router
  .route("/:id")
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
