const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promiseConnection } = require("../config/db")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
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