// Shoutout to Christopher for suggesting to put routes separate from controller
// Package Imports
const express = require("express");
// Controller Imports
const ticketController = require("../controller/ticketController");
// Util imports
const { authenticateToken } = require("../util/jwt");

const router = express.Router();

// Uses authenticateToken for URLs below declaration
router.use(authenticateToken);

// Protected route -> Employee user trying to create a ticket.
router.post("/submitticket", ticketController.SubmitTicket)

// Protected route -> Two options
// If employee -> See current pending tickets made by user
// If manager -> See all currently pending tickets
router.post("/viewtickets", ticketController.ViewTickets);

module.exports = router;