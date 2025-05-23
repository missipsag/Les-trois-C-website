const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const  {promiseConnection}  = require("../config/db")
const { genVerificationCode, sendVerificationCodetoUser } = require("../config/nodemailer")
const { v4: uuidv4 } = require("uuid");
const {createVerification} = require("../controllers/otpVerification.controllers");
const {getDateTime} = require("../config/datetime");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

module.exports.authentification = async function (req, res) {
    
    try {
        const { email } = req.body;
        if (!email) res.status(500).json({ message: "No email found." });

        const otpCode = genVerificationCode();
        console.log("sent otp : " +otpCode)
        // const falseOtp= "0000"
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
        
        const foundVerification = await promiseConnection(query);

        if (!foundVerification) return res.status(404).json({ message: "Verification not found." });


        const isValid = await bcrypt.compare(receivedOtp, foundVerification[0].hashedOtpCode);

        if (!isValid) return res.status(401).json({ message: "verification code not valid." });
        
        req.session.authentificated = true; 
        const upDateQuery = "UPDATE otpVerifications "
            + `SET used = 1 `
            + `WHERE email = '${email}';` 
        await promiseConnection(upDateQuery);
        
        return res.status(200).json({ message: "User authentificated." });

    } catch (err) {
        return  res.status(500).json({message : "Internal server Error", error : err})
    }
}
module.exports.register = async (req, res) => {
    try {
        const { userId, firstName, lastName, email , password, phone, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let sql = "INSERT INTO users ( userId, firstName, lastName, email, hashedPassword, phone, role )"
                + `VALUES (${userId}, ${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${phone}, ${role});`

        const isRegistered = await promiseConnection(sql);
        res.status(201)
            .json({ message: `User ${firstName + ' ' + lastName} registered ` });
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
            .json({message: "User login failed"})
    }

}