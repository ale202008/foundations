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

// Create user function
// args: user
// return: data on success, null if not
async function createUser(user){
    const command = new PutCommand({
        TableName,
        Item: user
    })

    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command complete in userDAO | createUser | data: ${JSON.stringify(data)}`);
        return data;
    }
    catch (err) {
        logger.error(`Error in userDAO | createUser | Error: ${err}`);
        return null;
    }
}

// Read function
// args: user_id
// return: data on success, null if not
async function getUserByID(user_id){
    const command = new GetCommand({
        TableName,
        Key: { user_id: user_id }
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`GET command complete in userDAO | getUserById | data: ${JSON.stringify(data)}`);
        return data.Item;
    }catch(err){
        logger.error(`Error in userDAO | getUserById | Error: ${err}`);
        return null;
    }
}

// Update function
// args: user
// return: data on success, null if not
async function updateUser(user){
    const params = {
        TableName,
        Key: { user_id: user.user_id },
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
        const data = await documentClient.send(command);
        logger.info(`UPDATE command complete in userDAO | updateUser | data: ${data}`);
        return data;
    }
    catch (err){
        logger.error(`Error in userDAO | updateUser | Error: ${err}`)
        return null;
    }
}

// Delete function
// args: user_id
// return: user_id on success, null if not
async function deleteUserByID(user_id){
    const command = new DeleteCommand({
        TableName,
        Key: { user_id }
    });

    try{
        await documentClient.send(command);
        logger.info(`DELETE command complete in userDAO | deleteUser | Deleted user: ${user_id}`);
        return user_id;
    }catch(err){
        logger.info(`Error in userDAO | deleteUser | Error: ${err}`);
        return null;
    }
}

// Query function
// args: username
// return: data on success, null if not
async function getUserByUsername(username){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username": username}
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command complete | getUserByUsername | data: ${JSON.stringify(data)}`);
        return data.Items[0];
    }catch(err){
        logger.error(`Error in userDAO | getUserByUsername | Error: ${err}`);
        return null;
    }
}


module.exports = {
    createUser,
    getUserByID,
    deleteUserByID,
    updateUser,
    getUserByUsername
}