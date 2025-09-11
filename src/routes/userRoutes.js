// Shoutout to Christopher for suggesting to put routes separate from controller
const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

// Estabishes register requests to register in controller
router.post("/register", userController.Register);

// Establishes post login requests to controller
router.post("/login", userController.Login);

// Base URL for after login
router.post("/protected", userController.Protected)
// app.get("/protected", authenticateToken, (req, res) => {
//     res.json({message: "Accessed Protected Route", user: req.user});
// });

module.exports = router;