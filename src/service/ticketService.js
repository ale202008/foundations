// package imports
const uuid = require("uuid");
// respository improts
const userDAO = require("../repository/userDAO");
const ticketDAO = require("../repository/ticketDAO");
// util imports
const { logger } = require("../util/logger");
const decodeJWT = require("../util/jwt");


// Create ticket
async function createTicket(ticket, user){
    const user = decodeJWT(user);
    const user = userDAO.getUserByID(user_id)

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