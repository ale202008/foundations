const express = require("express");
const userService = require("../service/userService")
const { loggerMiddleware } = require('../util/logger');

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

// Register route -> Service
const Register = async (req, res) => {
    const {username, password} = req.body;
    const role = req.body || "employee";
    const newUser = {
        username: username,
        password: password,
        role: role
    }

    const data = await userService.createUser(newUser);
    if (data){
        res.status(200).json({message: `Created user: ${JSON.stringify(data)}`});
    }
    else {
        res.status(400).json({message:`Failed to create user`, data: req.body});
    }

}

module.exports = {
    Register,
}