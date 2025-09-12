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
    if (!validifyTicket) {
        logger.error(`Invalid ticket: ${ticket}`);
        return null;
    }
    else if (!validifyUserIsEmployee){
        logger.error(`User is not an employee.`);
        return null;
    }

    const user = getUserByToken(token);

    ticket["ticket_id"] = uuid.v4();
    ticket["pending"] = true;
    ticket["user_id"] = user.user_id;

    const data = await ticketDAO.createTicket(ticket);
    
    if (data){
        logger.info(`Successful ticket creation | ticketService | createTicket | Ticket: ${ticket}`);
        return ticket;
    }
    else {
        logger.error(`Failed to create ticket | ticketService | createTicket`);
        return null;
    }

}

// getTicketsByUserId function
// Sends request to repository to get all tickets made by user
// if user is employee, return all user's ticket
// if user is manager, send all pending tickets
// args: user_id
// return: data containing all user tickets
async function getTicketsByUserId(token){
    const user = getUserByToken(token);

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
    const user = getUserByToken(token);

    if (validifyUserIsManager(user)){
        logger.info(`Success | ticketService | getAllPendingTickets | Tickets: ${data.Items}`);
        const data = await ticketDAO.getAllPendingTickets();
        return data;
    }
    else{
        logger.error(`Failed | ticketService | getAllPendingTickets`);
        return null;
    }

}

// validifiy ticket requiremnest
// - Amount, Description
// args: ticket
// return: true if both amount and description exist, false if not
function validifyTicket(ticket){
    return (!ticket.amount.length > 0 || !ticket.description.length > 0)
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
    const user = userDAO.getUserByID(decodedUser.id);
    return user;
}

module.exports = {
    createTicket,
    getTicketsByUserId,
    getAllPendingTickets,
    validifyUserIsManager,
    validifyUserIsEmployee,
    getUserByToken
}