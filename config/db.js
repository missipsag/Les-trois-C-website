const { Module } = require("module");
const mysql = require("mysql2"); 
const { promisify } = require("util");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const SQL_CREATE_USER_TABLE = "   CREATE TABLE  IF NOT EXISTS users ("
    + "userId varchar(255) UNIQUE PRIMARY KEY NOT NULL,"
    + "firstName varchar(255) NOT NULL ,"
    + "lastName varchar(255) NOT NULL,"
    + "email varchar(255) NOT NULL,"
    + "phone varchar(255),"
    + "role ENUM ('user', 'admin')"
    + ");";

const SQL_CREATE_ROOMS_TABLE = "CREATE TABLE IF NOT EXISTS rooms ("
    + "roomId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomName varchar(255) ,"
    + "capacity INTEGER NOT NULL, "
    + "type ENUM ('conference', 'wedding', 'special occasion', 'other'),"
    + "CHECK (capacity > 0) "
    + " );";
    
const SQL_CREATE_RESERVATION_TABLE = "CREATE TABLE IF NOT EXISTS reservations ("
    + "reservationId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomId varchar(255) NOT NULL,"
    + "userId varchar(255) NOT NULL,"
    + "date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    + "FOREIGN KEY (roomId) REFERENCES rooms(roomId),"
    + "FOREIGN KEY (userId) REFERENCES users(userId)"
    + ");"

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