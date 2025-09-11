// Shoutout to Christopher for suggesting to put routes separate from controller
const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

// Estabishes register requests to register in controller
router.post("/register", userController.Register);

module.exports = router;