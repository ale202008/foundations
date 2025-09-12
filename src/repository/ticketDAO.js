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
        logger.info(`UPDATE command complete | ticketDAO | createTicket | ticket: ${ticket}`);
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
async function getTicketsByUserId(user_id){
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        }
    });
    
    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command complete | ticketDAO | getTicketsByUserId | data ${JSON.stringify(data.Items)}`);
        return data;
    }
    catch (err){
        logger.error(`Error in ticketDAO | getTicketsByUserId | Error: ${err}`);
        return null;
    };
}

// getAllPendingTickets function
// args: none
// return: list of all currently pending tickets
async function getAllPendingTickets(){
    const params = {
        TableName,
        FilterExpression: "#pending = :pending",
        ExpressionAttributeNames: {
            "#pending": "pending",
        },
        ExpressionAttributeValues: {
            ":pending": true,
        },
    };
    const command = new ScanCommand(params)

    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command compelete | ticketDAO | getAllPendingTickets | data: ${data}`);
        return data;
    }
    catch (err) {
        logger.error(`Error in ticketDAO | getAllPendingTickets | Error: ${err}`);
        return null;
    }
}

// approveTicket
// args: ticket
// return: ticket, with approved field true
async function approveTicket(ticket){
    const params = {
        TableName,
        Key: {
            user_id: ticket.user_id,
            ticket_id: ticket.ticket_id
        },
        UpdateExpression: "SET #approved = if_not_exists(#approved, :approved), #pending = :pending",
        ExpressionAttributeNames: {
            "#approved": "approved",
            "#pending": "pending",
        },
        ExpressionAttributeValues: {
            ":approved": true,
            ":pending": false,
        },
        ReturnValues: "ALL_NEW"
    };
    const command = new UpdateCommand(params);

    try {
        const data = documentClient.send(command);
        logger.info(`UPDATE command complete | approveTicket | data: ${data.Items}`);
        return data
    }
    catch (err) {
        logger.error(`Error in ticketDAO | approveTicket | Error: ${err}`);
        return null;
    }
}


// denyTicket
// args: ticket_id, user_id
// return: ticket, with approved field false
async function denyTicket(ticket){
    const params = {
        TableName,
        Key: {
            user_id: ticket.user_id,
            ticket_id: ticket.ticket_id
        },
        UpdateExpression: "SET #approved = if_not_exists(#approved, :approved), #pending = :pending",
        ExpressionAttributeNames: {
            "#approved": "approved",
            "#pending": "pending",
        },
        ExpressionAttributeValues: {
            ":approved": false,
            ":pending": false,
        },
        ReturnValues: "ALL_NEW"
    };
    const command = new UpdateCommand(params);

    try {
        const data = documentClient.send(command);
        logger.info(`UPDATE command complete | denyTicket | data: ${data}`);
        return data
    }
    catch (err) {
        logger.error(`Error in ticketDAO | denyTicket | Error: ${err}`);
        return null;
    }
}

module.exports = {
    createTicket,
    getTicketsByUserId,
    getAllPendingTickets,
}