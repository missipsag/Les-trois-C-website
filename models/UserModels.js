const mysql = require("mysql2");
const { promisify } = require("util");
const connectDB = require("../config/db");
const promiseConnection = require("../config/db")

exports.getUsers = async () => {
    let query = "select * from users";
    const data = await promiseConnection(query);
    return data;
}