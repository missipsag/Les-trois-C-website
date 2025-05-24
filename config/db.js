const { Module } = require("module");
const mysql = require("mysql2"); 
const { promisify } = require("util");
const SQL_CREATE_USER_TABLE = require("../models/UserModels");
const SQL_CREATE_RESERVATION_TABLE = require("../models/ReservationModel");
const SQL_CREATE_REVIEW_TABLE = require("../models/ReviewModel");
const SQL_CREATE_ROOMS_TABLE = require("../models/RoomModel");
const SQL_CREATE_VERIFICATION_TABLE = require("../models/otpVerification");


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const connectDB = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: 'leCactus'
})


const promiseConnection = promisify(connectDB.query).bind(connectDB);

const initDb = async () => {
    console.log("INITIALIZING DATABASE...");
    await promiseConnection(SQL_CREATE_USER_TABLE.SQL_CREATE_USER_TABLE);
    await promiseConnection(SQL_CREATE_ROOMS_TABLE.SQL_CREATE_ROOMS_TABLE);
    await promiseConnection(SQL_CREATE_RESERVATION_TABLE.SQL_CREATE_RESERVATION_TABLE);
    await promiseConnection(SQL_CREATE_REVIEW_TABLE.SQL_CREATE_REVIEW_TABLE);
    await promiseConnection(SQL_CREATE_VERIFICATION_TABLE.SQL_CREATE_OTP_VERIFICATION);
}

connectDB.connect(function (err) {
    if (err) {
        console.log("MySQL CONNECTION ERROR : ".red, err);
    }
    else {
        console.log("MySQL DATABASE CONNECTED".blue);
    }
});

module.exports = {
    connectDB, 
    promiseConnection,
    initDb
}