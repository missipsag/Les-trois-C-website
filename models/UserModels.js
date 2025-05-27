const sequelize  = require("../config/db");
const Sequelize = require("sequelize");
    const User = sequelize.define('User', {
        userId: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        NID: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.ENUM('user', 'admin')
        }
    });

module.exports = User;




