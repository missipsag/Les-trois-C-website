const nodemailer = require("nodemailer");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
    },
});


// Wrap in an async IIFE so we can use await.
module.exports.sendAppointementEmailtoUser = async function(userEmail, firstName, lastName) {
    try{
        const info = await transporter.sendMail({
            from: process.env.APP_EMAIL,
            to: userEmail,
            subject: `ne-pas-répondre.${process.env.APP_NAME}: Confirmation de réservation.`,
            text: `Bonjour ${firstName + ' ' + lastName}, \n`
                + `Pour finaliser votre réservation, il est nécessaire de vous présenter en présentiel dans un délai de moins de 5 jours.\n`
                + `Sans cette démarche, votre réservation pourrait être annulée.\n`
                + `Nous vous attendons au plus vite afin de valider définitivement votre inscription.\n`
                + `Cordialement,\n Ce message a été envoyé automatiquement. Merci de ne pas y répondre.`, 
            html: `<p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>`
                + `<p>Pour finaliser votre réservation, il est nécessaire de vous présenter <strong>en présentiel dans un délai de moins de 5 jours</strong>.</p>`
                + `<p>Sans cette démarche, votre réservation pourrait être annulée.</p>`
                + `<p>Nous vous attendons au plus vite afin de valider définitivement votre réservation.</p>`
                + `<p>Cordialement,<br>`
                + `<em>Ce message a été envoyé automatiquement. Nous vous remercions de ne pas répondre.</em></p>`,
        });

        console.log("Message sent:", info.messageId);
        return true; 

    } catch (err) {
        console.error("Failed to send appointement email.");
        return false;
    }
}

module.exports.genVerificationCode = function () {
    const verificationCode = `${Math.floor(Math.random() * 9000 + 1000)}`;
    return verificationCode;
}

module.exports.sendVerificationCodetoUser = async function (userEmail, verificationCode, firstName = '', lastName ='') {

    try {
        const info = await transporter.sendMail({
            from: process.env.APP_EMAIL,
            to: userEmail,
            subject: `ne-pas-répondre.${process.env.APP_NAME}: Confirmation de l'authentification.`,
            text: `Bonjour ${firstName + ' ' + lastName}, \n`
                + `Pour garantir l'authentification de votre compte, utilisez le code de vérification suivant pour vous connecter.`
                + `\n \n${verificationCode}\n\n`
                + `Saissez le directement sur le site "${process.env.APP_NAME}" pour vous connecter.\n\n`
                + `Cordialement,\n`
                + `Ce message a été envoyé automatiquement. Nous vous remercions de ne pas répondre.`,
            html:`<p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>`
                +`<p>Pour garantir l'authentification de votre compte, utilisez le code de vérification suivant pour vous connecter :</p>`
                + `<p style="font-size: 1.5em; font-weight: bold; color: #007BFF;">${verificationCode}</p>`
                +` <p>Saisissez-le directement sur le site <strong>${process.env.APP_NAME}</strong> pour vous connecter.</p>`
                +`<p>Cordialement,<br>`
                +`<em>Ce message a été envoyé automatiquement. Nous vous remercions de ne pas répondre.</em></p> `,

        });

        console.log("Message sent:", info.messageId);
        return true;
    } catch (err) {
        console.error("Error: failed to send verification code.");
        return false;
    }

    
}
