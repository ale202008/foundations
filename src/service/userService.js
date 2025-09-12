// Package imports
const uuid = require("uuid");
const bcrypt = require("bcrypt");
// Util imports
const { logger } = require("../util/logger");
const userDAO = require("../repository/userDAO");

// Sends request to userDAO to create new user after validifying and
// processing user credentials
// args: user
// returns: data on success, null if not
async function createUser(user){
    if (await validateNewUser(user)){
        logger.error(`Username already exists.`);
        return null;
    }

    const saltRounds = 10;
    if (validateUserCredentials(user)){
        // Encrypts user's password to record in database
        const password = await bcrypt.hash(user.password, saltRounds);
        const newUser = {
            user_id: uuid.v4(),
            username: user.username,
            password: password,
            role: user.role || "employee"
        };
        const data = await userDAO.createUser(newUser);
        logger.info(`Created new user | userService | createUser | data: ${JSON.stringify(data)}`);
        return data;
    }
    else{
        logger.error(`Invalid username or password | userService | User: ${user}`);
        return null;
    }

}

// Validates user login information
// args: username, password
// return: user login, null if not
async function validateUserLogin(username, password) {
    const getUser = await userDAO.getUserByUsername(username);


    if (getUser && (await bcrypt.compare(password, getUser.password))){
        logger.info(`User ${username} successfully logged in.`);
        return getUser;
    }
    else {
        logger.info(`Invalid username or password`);
        return null;
    }
}

// Validates user credentials
//      - Username must not be blank
//      - Password must not be blank
// args: user
// return: bool if username and password length are greater than 0
function validateUserCredentials(user){
    const usernameBool = user.username.length > 0;
    const passwordBool = user.password.length > 0;
    return (usernameBool && passwordBool);
}

// Validates that username is not in use
// args: user
// returns: getUser bool
async function validateNewUser(user){
    const getUser = await userDAO.getUserByUsername(user.username);
    return !!getUser;
}

module.exports = {
    createUser,
    validateNewUser,
    validateUserCredentials,
    validateUserLogin
}