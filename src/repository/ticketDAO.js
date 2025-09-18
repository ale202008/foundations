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
        logger.info(`UPDATE command complete | ticketDAO | createTicket | Ticket: ${JSON.stringify(ticket)}`);
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
async function getTicketsByUserId(user_id, status){
    let params;

    if (status){
        params = {
            TableName,
            KeyConditionExpression: "user_id = :user_id",
            FilterExpression: "#status = :status",
            ExpressionAttributeNames: {
                "#status": "status",
            },
            ExpressionAttributeValues: {
                ":user_id": user_id,
                ":status": status,
            },
        }
    }
    else {
        params = {
            TableName,
            KeyConditionExpression: "user_id = :user_id",
            ExpressionAttributeValues: {
                ":user_id": user_id,
            },
        }
    }

    const command = new QueryCommand(params);
    
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
async function getAllTickets(status){
    let params;
    if (status){
        params = {
            TableName,
            FilterExpression: "#status = :status",
            ExpressionAttributeNames: {
                "#status": "status",
            },
            ExpressionAttributeValues: {
                ":status": status,
            },
        };
    }
    else {
        params = {
            TableName,
        }
    }

    const command = new ScanCommand(params)

    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command compelete | ticketDAO | getAllTickets | data: ${data}`);
        return data;
    }
    catch (err) {
        logger.error(`Error in ticketDAO | getAllTickets | Error: ${err}`);
        return null;
    }
}

// updateTicketStatus function
// args: ticket, desired status
// return: ticket, with updated status
async function updateTicketStatus(ticket, status){
    const params = {
        TableName,
        Key: {
            user_id: ticket.user_id,
            ticket_id: ticket.ticket_id
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": status.toLowerCase(),
        },
        ReturnValues: "ALL_NEW"
    };
    const command = new UpdateCommand(params);

    try {
        const data = await documentClient.send(command);
        logger.info(`UPDATE command complete | updateTicketStatus | data: ${JSON.stringify(data.Attributes)}`);
        return data.Attributes
    }
    catch (err) {
        logger.error(`Error in ticketDAO | updateTicketStatus | Error: ${err}`);
        return null;
    }
}

// getTicketUserId, function to get the ticket associated with ticket_id
// args: ticket_id
// return: ticket
async function getTicketById(ticket_id){
    const params = {
        TableName,
        FilterExpression: "#ticket_id = :ticket_id",
        ExpressionAttributeNames: {
            "#ticket_id": "ticket_id",
        },
        ExpressionAttributeValues: {
            ":ticket_id": ticket_id,
        },
    };
    const command = new ScanCommand(params);

    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command success | getTicketById | data: ${data}`);
        return data;
    }
    catch (err){
        logger.error(`Error in ticketDAO | getTicketById | Error: ${err}`);
        return null;
    }

}

module.exports = {
    createTicket,
    getTicketsByUserId,
    getAllTickets,
    getTicketById,
    updateTicketStatus,
}