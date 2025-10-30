const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
  getUserProfile,
  configureBusinessProfile,
} = require("../controllers/userController");

// Rutas protegidas
// GET /api/users/profile
router.route("/profile").get(protect, getUserProfile);

// PUT /api/users/profile/config
router.route("/profile/config").put(protect, configureBusinessProfile);

module.exports = router;
