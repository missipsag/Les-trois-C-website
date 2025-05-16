const express = require("express");
const colors = require("colors");
const PORT = 3000;
const mysql = require("mysql2");
const {connectDB, initDb} = require('./config/db.js');
const App = express();
const session = require("express-session");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// session config 
const SESSION_CONFIG = {
    name: 'session',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly:true
    }
}

App.use(session(SESSION_CONFIG));

// #Todos: 
/* 
    ! add ejs engine 
    ! add session and cookies
    ! add flash toasts

*/

initDb()

App.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`.blue);
})