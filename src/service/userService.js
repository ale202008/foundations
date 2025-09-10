const userDAO = require("../repository/userDAO");
const bcrypt = require("bcrypt");
const { logger } = require("../util/logger");
const uuid = require("uuid");

// Sends request to userDAO to create new user after validifying and
// processing user credentials
async function createUser(user){
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

        const data = await userDAO(newUser);
        logger.info(`Created new user in userService | createUser | data: ${data}`)
    }
    else{
        logger.error(`Failed to validate user credentials. User: ${user}`);
        return null
    }

}

// Validates user credentials
//      - Username must not be blank
//      - Password must not be blank
function validateNewUserCredentials(user){
    return ((user.username.length > 0) &&  (username.password > 0))
}