const SQL_CREATE_ROOMS_TABLE = "CREATE TABLE IF NOT EXISTS rooms ("
    + "roomId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomName varchar(255) ,"
    + "capacity INTEGER NOT NULL, "
    + "type ENUM ('conference', 'wedding', 'special occasion'),"
    + "CHECK (capacity > 0) "
    + " );";


const sequelize = require('../config/db');
const Sequelize = require('sequelize'); 
    const Room = sequelize.define('Room', {
        roomId: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        roomName: {
            type: Sequelize.STRING
        },
        capacity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        type: {
            type: Sequelize.ENUM('conference', 'wedding', 'special occasion')
        }
    });

module.exports = Room;


