require("dotenv").config();
const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authenticateToken");
const authController = require("../controllers/authController");

// Home
router.get("/", (req, res) => {
    res.render("index", { title: "Express Framework" });
});

// Auth
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;
