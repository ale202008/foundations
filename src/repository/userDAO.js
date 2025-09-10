// boilerplate imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

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
        logger.info(`PUT command complete - createUser function - line22: ${JSON.stringify(data)}`);
        return data;
    }
    catch (err) {
        logger.error(`Error in userDAO - createUser function - line24: ${err}`)
        return null;
    }
}

// Read
async function getUser(user_id){
    const command = new GetCommand({
        TableName,
        Key: { user_id }
    });

    try{
        const data = await documentClient.send(command);
        console.log(data.Item);
        return data.Item;
    }catch(error){
        console.error(error);
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
}

// Delete
async function deleteUser(user_id){
    const command = new DeleteCommand({
        TableName,
        Key: { user_id }
    });

    try{
        await documentClient.send(command);
        return user_id;
    }catch(error){
        console.error(error);
        return null;
    }
}

module.exports = {
    createUser,
    getUser,
    deleteUser,
    updateUser
}