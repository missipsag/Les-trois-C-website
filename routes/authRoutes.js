const express = require("express");
const router = express.Router();
const {authentification, otpVerification, register} = require("../controllers/auth.controllers");

router.route("/authentification")
    .post(authentification);

router.route("/otpVerification")
    .post(otpVerification);
//router.post("/login", login);


router.route("/register")
    .post(register);


module.exports = router; 