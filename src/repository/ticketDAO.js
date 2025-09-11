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

const TableName = "foundations_table";

// createTicket function
// args: ticket, user
// return: data on success, null if not
async function createTicket(ticket, user){
    const params = {
        TableName,
        Key: { user_id: user.user_id },
        UpdateExpression: "SET #tickets = list_append(if_not_exists(#tickets, :empty_list), :new_ticket)",
        ExpressionAttributeNames: {
            "#tickets": "tickets",
        },
        ExpressionAttributeValues: {
            ":new_ticket": [ ticket ],
            ":empty_list": [],
        },
        ReturnValues: "ALL_NEW",
    }
    const command = new UpdateCommand(params);

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

module.exports = {
    createTicket,
}