const { Module } = require("module");
const mysql = require("mysql2"); 
const { promisify } = require("util");
const SQL_CREATE_USER_TABLE = require("../models/UserModels");
const SQL_CREATE_RESERVATION_TABLE = require("../models/ReservationModel");
const SQL_CREATE_REVIEW_TABLE = require("../models/ReviewModel");
const SQL_CREATE_ROOMS_TABLE = require("../models/RoomModel");

const connectDB = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: 'leCactus'
})


promiseConnection = promisify(connectDB.query).bind(connectDB);

module.exports.initDb = async () => {
    console.log("INITIALIZING DATABASE...");
    await promiseConnection(SQL_CREATE_USER_TABLE);
    await promiseConnection(SQL_CREATE_ROOMS_TABLE);
    await promiseConnection(SQL_CREATE_RESERVATION_TABLE);
    await promiseConnection(SQL_CREATE_REVIEW_TABLE);
}

connectDB.connect(function (err) {
    if (err) {
        console.log("MySQL CONNECTION ERROR : ".red, err);
    }
    else {
        console.log("MySQL DATABASE CONNECTED".blue);
    }
});

module.exports.connectDB;