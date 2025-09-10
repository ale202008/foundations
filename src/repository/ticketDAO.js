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
async function createTicket(ticket){

}