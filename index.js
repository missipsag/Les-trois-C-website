const express = require("express");
const colors = require("colors");
const PORT = 3000;
const mysql = require("mysql2");
const connectDB = require('./config/db.js');
const App = express();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// #Todos: 
/* 
    ! add ejs engine 
    ! add session and cookies
    ! add flash toasts

*/



App.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`.blue);
})