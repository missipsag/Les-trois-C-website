const express = require("express");
const colors = require("colors");
const PORT = 3000;
const mysql = require("mysql2");
const {connectDB, initDb} = require('./config/db.js');
const App = express();
const session = require("express-session"); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const authRouter = require("./routes/authRoutes.js")

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
        httpOnly:true
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
initDb()

App.use("/auth",authRouter);

App.get('/', (req, res) => {
    console.log(req.session)
    console.log(req.session.id) 
    res.render("home")
});

App.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`.blue);
})