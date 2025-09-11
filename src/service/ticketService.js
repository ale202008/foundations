// package imports
const uuid = require("uuid");
// respository improts
const userDAO = require("../repository/userDAO");
const ticketDAO = require("../repository/ticketDAO");
// util imports
const { logger } = require("../util/logger");
const { decodeJWT } = require("../util/jwt");


// Create ticket
async function createTicket(ticket, token){
    if (!validifyTicket) {
        logger.error(`Invalid ticket: ${ticket}`);
        return null;
    }
    else if (!validifyUserIsEmployee){
        logger.error(`User is not an employee.`);
        return null;
    }

    let decodedUser = await decodeJWT(token);
    const user = await userDAO.getUserByID(decodedUser.user_id);
    const data = await ticketDAO.createTicket(ticket, getUser);
    
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
function validifyTicket(ticket){
    return (!ticket.amount || !ticket.description)
}

// validify user is an employee
function validifyUserIsEmployee(user){
    return (user.role.toLowerCase() == "employee")
}
