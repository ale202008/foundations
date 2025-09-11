// Shoutout to Christopher for suggesting to put routes separate from controller
// Package Imports
const express = require("express");
// Controller Imports
const userController = require("../controller/userController");
// Util imports
const { authenticateToken } = require("../util/jwt");

const router = express.Router();

// Estabishes register requests to register in controller
router.post("/register", userController.Register);

// Establishes post login requests to controller
router.post("/login", userController.Login);

// Uses authenticateToken for URLs below declaration
router.use(authenticateToken);

// Protected route
router.post("/protected", userController.Protected)

module.exports = router;