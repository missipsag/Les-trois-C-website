const {Sequelize} = require("sequelize")


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const sequelize = new Sequelize('leCactus', process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false // Disable logging; set to true for debugging
});


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.'); // eslint-disable-line no-console
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err); // eslint-disable-line no-console
    });

module.exports = sequelize