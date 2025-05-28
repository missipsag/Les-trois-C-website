const sequelize = require("../config/db");
const {Sequelize, DataTypes} = require("sequelize");
const reservationModel = require("./ReservationModel"); // Assuming ReservationModel is in the same directory



const User =  sequelize.define('User', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        NID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.ENUM('user', 'admin')
        }
    });

 






