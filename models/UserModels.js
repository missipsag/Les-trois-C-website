const mysql = require("mysql2");
const { promisify } = require("util");
const connectDB = require("../config/db");


const promiseConnection = promisify(connectDB.query).bind(connectDB);

exports.getUsers = async () => {
    let query = "select * from pet";
    const data = await promiseConnection(query);
    return data;
}