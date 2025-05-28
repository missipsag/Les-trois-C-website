const express = require("express")
const {Reservation,User, Review} = require("../models/index")
const {getPendingReservationsWithUsers, getAllReservations} = require("../controllers/reservations.controllers");
const router = express.Router()



router.route("/admin")
    .get(async (req, res) => {
        try {
            const users = await User.findAll();
            const reservations = await getPendingReservationsWithUsers();
            const reviews = await Review.findAll();
            console.log("#####reviews:", reviews);
            //console.log("Users:", users.length, "Reservations:", reservations.length, "Reviews:", reviews.length);  
            res.render("adminpagevf", { reviews, users, reservations});
        } catch (error) {
            console.error("Error fetching data for admin page:", error);
            res.status(500).send("Internal Server Error");
        }
    });


module.exports = router;