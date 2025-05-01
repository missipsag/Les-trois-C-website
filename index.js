const express = require("express");
const colors = require("colors");
const PORT = 3000;
const mysql = require("mysql2");
const App = express();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

let connectDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: 'leCactus'
})


connectDb.connect(function (err) {
    if (err) {
        console.log("MySQL CONNECTION ERROR : ".red, err);
    }
    else console.log("MySQL DATABASE CONNECTED".blue);        
});
