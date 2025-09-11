const express = require("express");
const userService = require("../service/userService")
const { loggerMiddleware } = require('../util/logger');
const jwt = require('jsonwebtoken');

const app = express();

const secretKey = "my-secret-key";

app.use(express.json());
app.use(loggerMiddleware);  

// Register route -> Service
const Register = async (req, res) => {
    const { username, password } = req.body;
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

// Login Route -> Service
const Login = async (req, res) => {
    const { username, password } = req.body;
    const data = await userService.validateUserLogin(username, password)
    if (data){
        const token = jwt.sign(
            {
                id: data.user_id,
                username
            },
            secretKey,
            {
                expiresIn: "20m"
            }
        );
        res.status(200).json({message:"You have logged in.", token})
    }
    else {
        res.status(400).json({message:"Invalid login."})
    }
}   

module.exports = {
    Register,
    Login,
}