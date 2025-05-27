const SQL_CREATE_RESERVATION_TABLE = "CREATE TABLE IF NOT EXISTS reservations ("
    + "reservationId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomId varchar(255) NOT NULL,"
    + "userId varchar(255) NOT NULL,"
    + "reservationDate DATE NOT NULL,"
    + "FOREIGN KEY (roomId) REFERENCES rooms(roomId),"
    + "FOREIGN KEY (userId) REFERENCES users(userId)"
    + ");"

const Sequelize = require("sequelize")
const sequelize = require("../config/db");

const Reservation = sequelize.define('Reservation', {
        reservationId: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        roomId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reservationDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    },
    {
        foreignKeyConstraints: true,
        references: {
            userId: {
                model: 'users',
                key: 'userId'
            },
            roomId: {
                model: 'rooms',
                key: 'roomId'
            }
        }
    }
);

module.exports = Reservation;
