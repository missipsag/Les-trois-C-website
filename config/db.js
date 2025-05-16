const mysql = require("mysql2"); 
const { promisify } = require("util");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const SQL_CREATE_USER_TABLE = "   CREATE TABLE USERS IF NOT EXISTS ("
    + "userId varchar(255) UNIQUE PRIMARY KEY NOT NULL,"
    + "firstName varchar(255) NOT NULL ,"
    + "lastName varchar(255) NOT NULL,"
    + "email varchar(255) NOT NULL,"
    + "phone varchar(255),"
    + "role ENUM (user, admin),"
    + ");"; 

const SQL_CREATE_ROOMS_TABLE = "CREATE TABLE ROOMS IF NOT EXISTS ("
    + "roomId varchar(255) NOT NULL PRIMARY KEY"
    + "roomName varchar(255) ,"
    + "capacity INTEGER NOT NULL "
    + " );";
    

const connectDB = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: 'leCactus'
})


exports.promiseConnection = promisify(connectDB.query).bind(connectDB);

exports.initDb = async () => {
    console.log("INITIALIZING DATABASE...")
    await promiseConnection(SQL_CREATE_USER_TABLE);
    await this.promiseConnection(SQL_CREATE_ROOMS_TABLE);
}

connectDB.connect(function (err) {
    if (err) {
        console.log("MySQL CONNECTION ERROR : ".red, err);
    }
    else {
        console.log("MySQL DATABASE CONNECTED".blue);
    }
});


module.exports = connectDB;