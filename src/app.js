const express = require("express");
const app = express();
const { logger, loggerMiddleware } = require("./util/logger");
const { authenticateToken } = require("./util/jwt");
const userRoutes = require("./routes/userRoutes");

const PORT = 3000;

app.use(express.json());

// Use Logger to log request
app.use(loggerMiddleware);

// We hook the userRoutes to "/"
app.use("/", userRoutes)

// Base get request
app.get("/", (req, res) =>{
    res.send("Please enter an username and password.");
})

// Base URL for after login
app.get("/protected", authenticateToken, (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})