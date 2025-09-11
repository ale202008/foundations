// package imports
const uuid = require("uuid");
// respository improts
const userDAO = require("../repository/userDAO");
const ticketDAO = require("../repository/ticketDAO");
// util imports
const { logger } = require("../util/logger");
const { decodeJWT } = require("../util/jwt");
const { fs } = require("fs");


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

    ticket["pending"] = true;
    const decodedUser = await decodeJWT(token);
    const user = await userDAO.getUserByID(decodedUser.id);
    const data = await ticketDAO.createTicket(ticket, user);
    
    if (data){
        logger.info(`Successful ticket creation | ticketService | createTicket | Ticket ${ticket}`);
        return data;
    }
    else {
        logger.error(`Failed to create ticket | ticketService | createTicket`);
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
    return (user.role.toLowerCase() == "employee")
}

module.exports = {
    createTicket,
}