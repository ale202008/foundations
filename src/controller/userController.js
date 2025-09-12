// Package Imports
const jwt = require('jsonwebtoken');
// Service imports
const userService = require("../service/userService");

const secretKey = "my-secret-key";

// Register route -> Service
const Register = async (req, res) => {
    if (userService.validateUserCredentials(req.body)){
        const data = await userService.createUser(req.body);
        
        if (data){
            res.status(200).json({message: `Created ${data.role}: ${data.username}`});
        }
        else {
            res.status(400).json({message:`Username ${data.username} already exists.`});
        }
    }
    else {
        res.status(400).json({message:`Username or Password cannot be blank.`});  
    }

}

// Login Route -> Service
const Login = async (req, res) => {
    if (userService.validateUserCredentials(req.body)){
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
            res.status(400).json({message:"Invalid username or password."})
        }
    }
    else {
        res.status(400).json({message:`Username or Password cannot be blank.`});  
    }

}

// Protected route -> The rest of the application
const Protected = async (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
}

module.exports = {
    Register,
    Login,
    Protected,
}