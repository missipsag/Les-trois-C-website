const sequelize = require("../config/db")
const Sequelize = require("sequelize")

    const Review = sequelize.define('Review', {
        reviewId: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        }, 
        authorLastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        authorFirstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        authorEmail: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
        rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        content : {
            type: Sequelize.TEXT,
            allowNull: false 
        }, 
        status: {
            type: Sequelize.ENUM('pending', 'approved'),
            defaultValue: 'pending'
        }
    });

module.exports = Review;


const SQL_CREATE_REVIEW_TABLE = "CREATE TABLE IF NOT EXISTS reviews ("
    + "reviewId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomId varchar(255) NOT NULL,"
    + "userId varchar(255) NOT NULL,"
    + "FOREIGN KEY (roomId) REFERENCES rooms(roomId),"
    + "FOREIGN KEY (userId) REFERENCES users(userId)"
    + ");";