const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Reservation = sequelize.define('Reservation', {
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
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('pending', 'approved'),
        defaultValue: 'pending'
    }
});


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

User.hasMany(Reservation, {
    foreignKey: 'userId',
    as: 'reservations' // Access reservations via user.reservations
});

Reservation.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});


module.exports = {sequelize, User, Reservation, Review};