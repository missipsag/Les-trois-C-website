const SQL_CREATE_RESERVATION_TABLE = "CREATE TABLE IF NOT EXISTS reservations ("
    + "reservationId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomId varchar(255) NOT NULL,"
    + "userId varchar(255) NOT NULL,"
    + "reservationDate DATE NOT NULL,"
    + "FOREIGN KEY (roomId) REFERENCES rooms(roomId),"
    + "FOREIGN KEY (userId) REFERENCES users(userId)"
    + ");"

const {Sequelize, DataTypes} = require("sequelize")
const sequelize = require("../config/db");
const userModel = require("./UserModels")


    const Reservation =  sequelize.define('Reservation', {
        reservationId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        roomId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reservationDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed'),
            defaultValue: 'pending'
        }
    },
        {
            timestamps: true, // Automatically adds createdAt and updatedAt fields
            tableName: 'Reservations', // Explicitly set the table name
    
    
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
    )





