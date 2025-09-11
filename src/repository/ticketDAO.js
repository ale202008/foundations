// Package imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,
        GetCommand,
        PutCommand,
        ScanCommand, 
        QueryCommand, 
        UpdateCommand } = require("@aws-sdk/lib-dynamodb");
// Util imports 
const { logger } = require("../util/logger");


const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "foundations_ticket_table";

// createTicket function
// args: ticket
// return: data on success, null if not
async function createTicket(ticket){
    const command = new PutCommand({
        TableName,
        Item: ticket,
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`UPDATE command complete | ticketDAO | createTicket | data: ${data}`);
        return data;
    }
    catch (err) {
        logger.error(`Error in ticketDAO | createTicket | Error: ${err}`);
        return null;
    }
}

// getTicketByUserId function
// args: user_id
// return: list of all user's tickets
async function getTicketByUserId(user_id){

}

// getAllPendingTickets function
// args: none
// return: list of all currently pending tickets

// getPreviousTickets function
// args: user_id
// return: list of all user's previously answered tickets

// approveTicket
// args: ticket
// return: ticket, with approved field true

// denyTicket
// args: ticket_id, user_id
// return: ticket, with approved field false

module.exports = {
    createTicket,
}