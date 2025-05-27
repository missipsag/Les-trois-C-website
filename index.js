const express = require("express");
const colors = require("colors");
const PORT = 3000;
const mysql = require("mysql2");
const { connectDB, initDb } = require('./config/db.js');
const sequelize = require('./config/db');
const  User  = require('./models/UserModels');
const Room  = require('./models/RoomModel');
const Reservation  = require('./models/ReservationModel');
const  Review  = require('./models/ReviewModel');
const OtpVerification  = require('./models/otpVerification');

const App = express();
const session = require("express-session");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const authRouter = require("./routes/authRoutes.js")
const admin = require("./routes/adminRoutes.js")
const reviewRoutes = require("./routes/reviewRoutes.js");


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// session config 
const SESSION_CONFIG = {
    name: 'session',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

App.use(session(SESSION_CONFIG));

// #Todos: 
/* 
    ! add ejs engine 
    ! add session and cookies
    ! add flash toasts

*/

// method override 
App.use(methodOverride('_method'));
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(express.static(path.join(__dirname, './public')))
App.engine('ejs', ejsMate);
App.set('views', path.join(__dirname, 'views'));
App.set('view engine', 'ejs');


//initialize our Database


   


App.use("/auth", authRouter);
App.use(admin)
App.use("/review", reviewRoutes);

App.get('/', (req, res) => {
    console.log(req.session)
    console.log(req.session.id)
    res.render("home")
});

sequelize.sync({force: false}).then((req) => {
    console.log("Database synchronisation successful")
    App.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`.blue);
})
}).catch((error) => {
    console.log('ERROR synchronizing the database : ', error)
})

