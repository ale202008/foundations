// Service imports
const ticketService = require("../service/ticketService")

// Submit Ticket Route -> Service
const SubmitTicket = async (req, res) => {
    const data = await ticketService.createTicket(req.body, req.token);
    
    if (data){
        res.status(200).json({message: `Created new ticket.`, ticket: data});
    }
    else {
        res.status(400).json({message:`Failed to create new ticket`, data: req.body});
    }
}

// View Ticket Route -> Service
const ViewTickets = async (req, res) => {
    const user_role = (await ticketService.getUserByToken(req.token)).role

    if (user_role == "employee"){
        const data = await ticketService.getTicketsByUserId(req.token);

        if (data){
            res.status(200).json({message: `Your tickets: `, tickets: data.Items});
        }
        else {
            res.status(400).json({message:`Failed to retrieve tickets.`, data: req.body});
        }
    }
    else if (user_role == "manager") {
        const data = await ticketService.getAllPendingTickets(req.token);

        if (data){
            res.status(200).json({message: `${data.Items.length} pending tickets: `, tickets: data.Items});
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

    const ticket_id = req.url.split("/")[2];
    
    const data = await ticketService.updateTicketStatus(ticket_id, req.body.status);

    if (data){
        res.status(200).json({message: `Ticket: ${ticket_id} status is ${req.body.status}`});
    }
    else {
        res.status(400).json({message:`Failed to update status.`});
    }
}

module.exports = {
    SubmitTicket,
    ViewTickets,
    UpdateTicketStatus,
}