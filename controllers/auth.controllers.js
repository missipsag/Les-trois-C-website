const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const  {promiseConnection}  = require("../config/db")
const { genVerificationCode, sendVerificationCodetoUser, sendAppointementEmailtoUser } = require("../config/nodemailer")
const { v4: uuidv4 } = require("uuid");
const {createVerification} = require("../controllers/otpVerification.controllers");
const { getDateTime } = require("../config/datetime");
const { createReservation } = require("./reservations.controllers")
const {createUser} = require("../controllers/users.controllers")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

module.exports.authentification = async function (req, res) {
    
    try {
        const { email } = req.body;
        if (!email) res.status(500).json({ message: "No email found." });

        const otpCode = genVerificationCode();
        console.log("sent otp : " +otpCode)
        //const falseOtp= "0000"
        sendVerificationCodetoUser(email, otpCode);

        const verificationId = uuidv4();

        // expires in 30 minutes
        let expiresAt = getDateTime(1000 * 60 *30);
        const hashedOtp = await bcrypt.hash(otpCode, 10);
        //console.log("hashedh otp : ", hashedOtp);

        const createdVerification = await createVerification(
            verificationId,
            email,
            hashedOtp,
            expiresAt
        ); 
        req.session.email = email;
        //console.log(createdVerification)
        res.status(200).json({message : "Otp code sent."})

    } catch (err) {
        res.status(500).json({ message: "User authentification failed.", error: err });
    }
}

module.exports.otpVerification = async function (req, res) {
    try {
        // must get email from session.

        const email = req.session.email;

        const { receivedOtp } = req.body;
        const currDateTime = getDateTime();
        const query = "SELECT hashedOtpCode FROM otpVerifications WHERE "
            + `email = '${email}' AND expiresAt > '${currDateTime}' AND used = 0;`
        console.log("####### inside otp verification controllers")
        const foundVerification = await promiseConnection(query);

        if (!foundVerification) return res.status(404).json({ message: "Verification not found." });


        const isValid = await bcrypt.compare(receivedOtp, foundVerification[0].hashedOtpCode);

        if (!isValid) return res.status(401).json({ message: "verification code not valid." });
        
        req.session.authentificated = true; 
        const upDateQuery = "UPDATE otpVerifications "
            + `SET used = 1 `
            + `WHERE email = '${email}';` 
        await promiseConnection(upDateQuery);
        console.log("### after updating the otp verification ")
        
        return res.status(200).json({ message: "User authentificated." });

    } catch (err) {
        return  res.status(500).json({message : "Internal server Error", error : err})
    }
}
module.exports.register = async (req, res) => {
    try {   
        console.log("##### inside register controller")
        if (! req.session.authentificated) return res.status(401).json({message : "Unauthenticated."})
        console.log("##### session email : ", req.session.email)
        if (!req.session.email) return res.status(404).json({ message: "email not found." })
       
        // avoir nom prénom tel NID date de réservation
        const { firstName, lastName, phone, NID } = req.body; 
        console.log("##### personal information : " , firstName, lastName, phone, NID)
        
        const userId = uuidv4();
        
        const createdUser = await createUser(userId, firstName, lastName, req.session.email, NID, phone); // role will be at default user

        if (!createdUser) return res.status(500).json({ message: "User registration failed for some reason." });
          
        const isSent = sendAppointementEmailtoUser(req.session.email, firstName, lastName);
        
        if (!isSent) return res.status(500).json({ message: "Error : Couldn't send appointement email for some reason." })
        
        // creating reservation we need reservationId, roomId, userId, reservationDate,
        const reservationId = uuidv4(); 
        // delete roomId, falseReservationID
        const roomId = '99f2fcf9-311f-4b35-a04e-5b658018b83f'
        const falseReservationDate = '2025-06-13'
        const isCreated =  createReservation(reservationId, roomId, userId, falseReservationDate)
        
        if( ! isCreated) return res.status(500).json({message : "failed to create reservation"})
        
        return res.status(200).json({ message:` User ${firstName + ' ' + lastName} registration complete. Appointement Email sent.`})
        
    } catch (err) {
        res.status(500)
            .json({ message: "User registration failed" });
    }
} 


module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const getUserQuery = "SELECT * FROM users "
            + `WHERE email = ${email};`;
        
        const foundUser = await promiseConnection(getUserQuery);
        if (! foundUser) return res.status(404).json({message: "User not found."})
        
        
        if (!(await bcrypt.compare(password, foundUser.hashedPassword))) return res.status(400).json({message : "Invalid Credentials."})
        
        const token = jwt.sign(
            {   id: foundUser.userId,
                role: foundUser.role}, 
            process.env.JWT_SECRET,
            { expiresIn : "1h" }
        )
        res.status(200).json(token, { message: "User logged in." });
        
    } catch (err) {
        res.status(500)
            .json({ message: "User login failed" });
    }

}