// Package Imports
const express = require("express");
const jwt = require('jsonwebtoken');
// Service imports
const userService = require("../service/userService");
const ticketService = require("../service/ticketService")

// Submit Ticket Route -> Service
const SubmitTicket = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const data = await ticketService.createTicket(req.body, token);
    
    if (data){
        res.status(200).json({message: `Created new ticket for user: ${JSON.stringify(data)}`});
    }
    else {
        res.status(400).json({message:`Failed to create new ticket`, data: req.body});
    }
}

module.exports = {
    SubmitTicket,
}