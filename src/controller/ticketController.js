// Service imports
const { logger } = require("../util/logger");
const ticketService = require("../service/ticketService")

// Submit Ticket Route -> Service
const SubmitTicket = async (req, res) => {
    if (!ticketService.validifyUserIsEmployee(await ticketService.getUserByToken(req.token))){
        res.status(400).json({message:`Only an employee can make tickets.`, data: req.body});
    }

    const data = await ticketService.createTicket(req.body, req.token);
    
    if (data){
        res.status(200).json({message: `Created new ticket.`, ticket: data});
    }
    else {
        res.status(400).json({message:`Invalid amount or description`, data: req.body});
    }
}

// View Ticket Route -> Service
const Tickets = async (req, res) => {
    const user_role = (await ticketService.getUserByToken(req.token)).role;
    const status = req.query.status || null;
    let data;

    if (user_role == "employee"){
        data = await ticketService.getTicketsByUserId(req.token, status);

        if (data){
            res.status(200).json({message: `Your tickets [${data.Items.length}]: `, tickets: data.Items});
        }
        else {
            res.status(400).json({message:`Failed to retrieve tickets.`, data: req.body});
        }
        
    }
    else if (user_role == "manager") {
        data = await ticketService.getAllTickets(req.token, status)

        if (data){
            res.status(200).json({message: `[${data.Items.length}] tickets: `, tickets: data.Items});
        }
        else {
            res.status(400).json({message:`Failed to retrieve tickets.`, data: req.body});
        }
    }

}

// ViewTicket -> UpdateTicketStatus -> Service
const UpdateTicketStatus = async (req, res) => {
    if (!req.url.startsWith("/ticket")){
        logger.error(`Invalid url for route | No Ticket Id | URL: ${req.url}`);
        res.status(400).json({message:`How did you get here?`, data: req.body});
    }
    else if (!ticketService.validifyUserIsManager(await ticketService.getUserByToken(req.token))){
        logger.error(`Only manager can approve/deny tickets.`);
        res.status(400).json({message:`Only manager can approve/deny tickets.`, data: req.body});
    }
    else{
        const ticket_id = req.url.split("/")[2];
    
        const data = await ticketService.updateTicketStatus(ticket_id, req.body.status, req.token);

        if (data){
            res.status(200).json({message: `Ticket: ${ticket_id} status is ${data.status}`});
        }
        else {
            res.status(400).json({message:`Failed to update status.`});
        }
    }
}

module.exports = {
    SubmitTicket,
    Tickets,
    UpdateTicketStatus,
}