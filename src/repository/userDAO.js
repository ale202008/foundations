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

// Create
async function createUser(user){
    const command = new PutCommand({
        TableName,
        Item: user
    })

    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command complete in userDAO | createUser function | data: ${JSON.stringify(data)}`);
        return data;
    }
    catch (err) {
        logger.error(`Error in userDAO | createUser function | Error: ${err}`);
        return null;
    }
}

// Read
async function getUserByID(user_id){
    const command = new GetCommand({
        TableName,
        Key: { user_id: user_id }
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`GET command complete in userDAO | getUserById | data: ${JSON.stringify(data)}`);
        return data.Item;
    }catch(error){
        logger.error(`Error in userDAO | getUserById | Error: ${err}`);
        return null;
    }
}

// Update
async function updateUser(user){
    const params = {
        TableName,
        Key: {user_id: user.user_id},
        UpdateExpression: "SET #username = :username, #password = :password, #role = :role, #tickets = :tickets",
        ExpressionAttributeNames: {
            "#username": "username",
            "#password": "password",
            "#role": "role",
            "#tickets": "tickets"
        },
        ExpressionAttributeValues: {
            ":username": user.username,
            ":password": user.password,
            ":role": user.role,
            ":tickets": user.tickets
        },
        ReturnValues: "ALL_NEW"  
    }
    const command = new UpdateCommand(params)
    
    try {
        const result = await documentClient.send(command);
        logger.info(`UPDATE command complete in userDAO | updateUser function | data: ${result}`);
        return result;
    }
    catch (err){
        logger.error(`Error in userDAO | updateUser function | Error: ${err}`)
        return null;
    }
}

// Delete
async function deleteUser(user_id){
    const command = new DeleteCommand({
        TableName,
        Key: { user_id }
    });

    try{
        await documentClient.send(command);
        logger.info(`DELETE command complete in userDAO | deleteUser function | Deleted user: ${user_id}`);
        return user_id;
    }catch(err){
        logger.info(`Error in userDAO | deleteUser function | Error: ${err}`);
        return null;
    }
}

// Query
async function getUserByUsername(username){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username": username}
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command complete | getUserByUsername| data: ${JSON.stringify(data)}`);
        return data.Items[0];
    }catch(err){
        logger.error(`Error in userDAO | getUserByUsername | Error: ${err}`);
        return null;
    }
}

const mockTickets = [
    {
        ticket_id: uuid.v4(),
        amount: 100, 
        description: "I spent it all on movie tickets"
    },
    {
        ticket_id: uuid.v4(),
        amount: 100000, 
        description: "Listen, I think this coin will go to the moon!"
    },
]
const mockUser = {
    user_id: uuid.v4(),
    username: "testUser",
    password: "testPassword",
    role: "employee",
    tickets: mockTickets
}
// createUser(mockUser);

module.exports = {
    createUser,
    getUserByID,
    deleteUser,
    updateUser,
    getUserByUsername
}