const express = require("express");
const router = express.Router();
const {getUserProfile} = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware");

// Aplicamos 'protect' antes de la función del controlador
router.route("/profile").get(protect, getUserProfile);

module.exports = router;
