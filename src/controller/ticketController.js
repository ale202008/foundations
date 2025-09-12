// Service imports
const ticketService = require("../service/ticketService")

// Submit Ticket Route -> Service
const SubmitTicket = async (req, res) => {
    const data = await ticketService.createTicket(req.body, req.token);
    
    if (data){
        res.status(200).json({message: `Created new ticket for user: `, ticket: data});
    }
    else {
        res.status(400).json({message:`Failed to create new ticket`, data: req.body});
    }
}

// View Ticket Route -> Service
const ViewTickets = async (req, res) => {
    const user_role = (await ticketService.getUserByToken(req.token)).role

    if (user_role == "employee"){
        const data = await ticketService.getTicketsByUserId(token);

        if (data){
            res.status(200).json({message: `Your tickets: `, tickets: data.Items});
        }
        else {
            res.status(400).json({message:`Failed to retrieve tickets.`, data: req.body});
        }
    }
    else if (user_role == "manager") {
        const data = await ticketService.getAllPendingTickets(token);

        if (data){
            res.status(200).json({message: `${data.Items.length} pending tickets: `, tickets: data.Items});
        }
        else {
            res.status(400).json({message:`Failed to retrieve tickets.`, data: req.body});
        }
    }

}

// ViewTicket -> ApproveTicket -> Service
const ApproveTicket = async (req, res) => {
    
}

module.exports = {
    SubmitTicket,
    ViewTickets,
    ApproveTicket,
}