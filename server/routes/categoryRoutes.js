const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Todas estas rutas necesitan autenticación, usamos el middleware 'protect'
router
  .route("/")
  .get(protect, getCategories) // GET /api/categories
  .post(protect, createCategory); // POST /api/categories

router
  .route("/:id")
  .put(protect, updateCategory) // PUT /api/categories/:id
  .delete(protect, deleteCategory); // DELETE /api/categories/:id

module.exports = router;
