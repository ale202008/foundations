const userDAO = require("../repository/userDAO");
const bcrypt = require("bcrypt");
const { logger } = require("../util/logger");
const uuid = require("uuid");

// Sends request to userDAO to create new user after validifying and
// processing user credentials
async function createUser(user){
    if (await validateNewUser(user)){
        logger.error(`Username already exists. User: ${user}`);
        return null;
    }

    const saltRounds = 10;
    if (validateNewUserCredentials(user)){
        // Encrypts user's password to record in database
        const password = await bcrypt.hash(user.password, saltRounds);
        const newUser = {
            user_id: uuid.v4(),
            username: user.username,
            password: password,
            role: user.role || "employee"
        };
        const data = await userDAO.createUser(newUser);
        logger.info(`Created new user in userService | createUser | data: ${data}`)
    }
    else{
        logger.error(`Failed to validate user credentials. User: ${user}`);
        return null
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
    username: "testUser3",
    password: "testPassword",
    role: "financemanager",
    tickets: mockTickets
}
createUser(mockUser);

// Validates user credentials
//      - Username must not be blank
//      - Password must not be blank
function validateNewUserCredentials(user){
    const usernameBool = user.username.length > 0;
    const passwordBool = user.password.length > 0;

    return (usernameBool && passwordBool);
}

// Validates that username is not in use
async function validateNewUser(user){
    const getUser = await userDAO.getUserByUsername(user.username);
    return !!getUser;
}