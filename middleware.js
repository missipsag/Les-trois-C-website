const { body, validationResult } = require("express-validator")



const validateEmail = [

    body('email')
        .exists({ checkFalsy: true }).withMessage("Veuillez saisir votre adresse mail.")
        .trim()
        .isString().withMessage("L'email doit être une suite de caractère")
        .isEmail().withMessage("Veuillez saisir une adresse mail valide")
        .normalizeEmail()
        .escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array() })
        }
        return next()
    }


];


const validateOtpCode = [

    body('receivedOtp')
        .exists().withMessage("Veuillez saisir le code Otp reçu sur votre adresse mail.")
        .isNumeric().withMessage("Le code otp doit être composé que de chiffres.")
        .isLength({ min: 4, max: 4 }).withMessage("Le code otp doit être composé de 4 chiffre.")
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array()})
        }

        return next();
    }
]

module.exports = {
    validateEmail,
    validateOtpCode
};





