const SQL_CREATE_OTP_VERIFICATION = "CREATE TABLE IF NOT EXISTS otpVerifications ( "
    + "verficationId varchar(255) NOT NULL PRIMARY KEY,"
    + "email varchar(255) NOT NULL, "
    + "hashedOtpCode varchar(255) NOT NULL,"
    + "expiresAt DATETIME NOT NULL,"
    + "used BIT(1) NOT NULL"
    + ");";

const sequelize = require('../config/db');
const {Sequelize, DataTypes} = require('sequelize');

    const OtpVerification = sequelize.define('OtpVerification', {
        verificationId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hashedOtpCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });
 


