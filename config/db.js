const mysql = require("mysql2"); 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const connectDB = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: 'leCactus'
})


connectDB.connect(function (err) {
    if (err) {
        console.log("MySQL CONNECTION ERROR : ".red, err);
    }
    else console.log("MySQL DATABASE CONNECTED".blue);        
});


module.exports = connectDB;