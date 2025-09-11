// boilerplate imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,
        GetCommand,
        PutCommand,
        ScanCommand, 
        QueryCommand, 
        UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");
const uuid = require("uuid");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "foundations_table";

// CRUD
async function createTicket(ticket, user){
    console.log(user.user_id)
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

const mockUser = require("../util/mockUser")
let user = mockUser;
user.user_id = "62440cab-b109-4cf5-8261-f2ab1e57da11"
user.password = "99999"
user.Username = "Banana"
const mockTicket = {
        ticket_id: uuid.v4(),
        amount: 100, 
        description: "testticket"
    }

createTicket(mockTicket, user);