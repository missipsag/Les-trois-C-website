const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { genVerificationCode, sendVerificationCodetoUser, sendAppointementEmailtoUser } = require("../config/nodemailer");
const { v4: uuidv4 } = require("uuid");
const  {getDateTime}  = require("../config/datetime");
const  User  = require("../models/UserModels");
const OtpVerification  = require("../models/otpVerification");
const Reservation = require("../models/ReservationModel");
const { Op } = require("sequelize");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

module.exports.authentification = async function (req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(500).json({ message: "No email found." });
        
        const otpCode = genVerificationCode();
        falseOtp = '0000'
        console.log("sent otp : " + otpCode);
        sendVerificationCodetoUser(email, otpCode);

        const verificationId = uuidv4();
        const expiresAt = getDateTime(1000 * 60 * 30); // Expires in 30 minutes
        
        const hashedOtp = await bcrypt.hash(otpCode, 10);
        
        const createdotpVerification = await OtpVerification.create({ verificationId, email, hashedOtpCode: hashedOtp, expiresAt, used: false });
        
        req.session.email = email;
        res.status(200).json({ message: "Otp code sent." });
    } catch (err) {
        res.status(500).json({ message: "User authentication failed.", error: err });
    }
};

module.exports.otpVerification = async function (req, res) {
    try {
        const email = req.session.email;
        const { receivedOtp } = req.body;
        
        const currDateTime = getDateTime();

        const foundVerification = await OtpVerification.findOne({
            where: {
                email,
                expiresAt: { [Op.gt]: currDateTime },
                used: false
            }
        });
        console.log("foundVerification: ", foundVerification)   

        if (!foundVerification) return res.status(404).json({ message: "Verification not found." });

        const isValid = await bcrypt.compare(receivedOtp, foundVerification.hashedOtpCode);

        if (!isValid) return res.status(401).json({ message: "Verification code not valid." });

        await foundVerification.update({ used: true });

        req.session.authenticated = true;
        res.status(200).json({ message: "User authenticated." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error.", error: err });
    }
};

module.exports.register = async (req, res) => {
    try {
        if (!req.session.authenticated) return res.status(401).json({ message: "Unauthenticated." });

        const { firstName, lastName, phone, NID } = req.body;
        const email = req.session.email;

        const userId = uuidv4();
        const createdUser = await User.create({ userId, firstName, lastName, email, NID, phone, role: 'user' });

        if (!createdUser) return res.status(500).json({ message: "Couldn't create user." });

        sendAppointementEmailtoUser(email, firstName, lastName);

        const reservationId = uuidv4();
        const roomId = '99f2fcf9-311f-4b35-a04e-5b658018b83f';
        const falseReservationDate = '2025-06-13';

        const createdReservation = await Reservation.create({ reservationId, roomId, userId, reservationDate: falseReservationDate });

        if (!createdReservation) return res.status(500).json({ message: "Failed to create reservation." });

        res.status(200).json({ message: `User ${firstName} ${lastName} registration complete. Appointment email sent.` });
    } catch (err) {
        res.status(500).json({ message: "User registration failed.", error: err });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ where: { email } });

        if (!foundUser) return res.status(404).json({ message: "User not found." });

        const isPasswordValid = await bcrypt.compare(password, foundUser.hashedPassword);

        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign(
            { id: foundUser.userId, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, message: "User logged in." });
    } catch (err) {
        res.status(500).json({ message: "User login failed.", error: err });
    }
};