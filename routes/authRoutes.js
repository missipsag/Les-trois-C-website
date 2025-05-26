const express = require("express");
const router = express.Router();
const {authentification, otpVerification, register} = require("../controllers/auth.controllers");
const {validateEmail, validateOtpCode} = require("../middleware")
router.route("/authentification")
    .post(...validateEmail, authentification);

router.route("/otpVerification")
    .post(...validateOtpCode, otpVerification);
//router.post("/login", login);


router.route("/register")
    .post(register);


module.exports = router; 