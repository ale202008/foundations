// package imports
const uuid = require("uuid");
// respository improts
const userDAO = require("../repository/userDAO");
const ticketDAO = require("../repository/ticketDAO");
// util imports
const { logger } = require("../util/logger");
const { decodeJWT } = require("../util/jwt");


// Create ticket
// args: ticket, token
// return: null on invalid ticket or token
// return: data of ticket upon success
async function createTicket(ticket, token){
    if (!validifyUserIsEmployee(await getUserByToken(token))) {
        logger.error(`User is not an employee.`);
        return null;
    }
    else if (!validifyTicket(ticket)){
        logger.error(`Invalid amount or description. Ticket: ${JSON.stringify(ticket)}`);
        return null;
    }
    else{
        const user = await getUserByToken(token);

        ticket["ticket_id"] = uuid.v4();
        ticket["status"] = "pending";
        ticket["user_id"] = user.user_id;

        const data = await ticketDAO.createTicket(ticket);
        
        if (data){
            logger.info(`Successful ticket creation | ticketService | createTicket | Ticket: ${JSON.stringify(ticket)}`);
            return ticket;
        }
        else {
            logger.error(`Failed to create ticket | ticketService | createTicket`);
            return null;
        }
    }
}

// getTicketsByUserId function
// Sends request to repository to get all tickets made by user
// if user is employee, return all user's ticket
// if user is manager, send all pending tickets
// args: user_id
// return: data containing all user tickets
async function getTicketsByUserId(token){
    const user = await getUserByToken(token);

    const data = await ticketDAO.getTicketsByUserId(user.user_id)

    if (data){
        logger.info(`Success | ticketService | getTicketsByUserId | Tickets: ${data.Items}`);
        return data;
    }
    else {
        logger.error(`Failed | ticketService | getTicketsByUserId`);
        return null;
    }
}

// getAllPendingTickets
// Requests from repository to get all current pending tickets.
// Can only be done if user is manager
// args: token
// return: all pending tickets object
async function getAllPendingTickets(token){
    const user = await getUserByToken(token);

    if (validifyUserIsManager(user)){
        const data = await ticketDAO.getAllPendingTickets();
        logger.info(`Success | ticketService | getAllPendingTickets | Tickets: ${JSON.stringify(data.Items)}`);
        return data;
    }
    else{
        logger.error(`Failed | ticketService | getAllPendingTickets`);
        return null;
    }

}

// approveTicket, aproves ticket
// if user is a manager
// args: ticket_id
// return: data
async function updateTicketStatus(ticket_id, status){
    if (!validifyUserIsManager){    
        logger.error("User is not a manager.")
        return null;
    }

    const data = await getTicketById(ticket_id);
    const ticket = data.Items[0];

    if (ticket){
        const data = await ticketDAO.updateTicketStatus(ticket, status);
        logger.info(`Success | ticketService | approveTicket | Ticket: ${data}`);
        return data
    }
    else {
        logger.error(`Failed | invalid Ticket ID | ticketService | approveTicket `);
        return null;
    }
}

// validifiy ticket requiremnest
// - Amount, Description
// args: ticket
// return: true if both amount and description exist, false if not
function validifyTicket(ticket){
    return (ticket.amount != null && ticket.amount >= 0 && ticket.description.trim().length > 0);
}

// validify user is an employee
// args: user
// return: true if user is an employee, false if not
function validifyUserIsEmployee(user){
    return (user.role.toLowerCase() == "employee");
}

// validify user is a manager
// args: user
// return true if user is a manager, false if not
function validifyUserIsManager(user){
    return (user.role.toLowerCase() == "manager");
}

// function that decodes user from token, getting user
async function getUserByToken(token){
    const decodedUser = await decodeJWT(token);
    const data = await userDAO.getUserByID(decodedUser.id);
    return data.Item;
}

// handler function that gets ticket by its id
async function getTicketById(ticket_id){
    return await ticketDAO.getTicketById(ticket_id);
}

module.exports = {
    createTicket,
    getTicketsByUserId,
    getAllPendingTickets,
    validifyUserIsManager,
    validifyUserIsEmployee,
    getUserByToken,
    updateTicketStatus,
}