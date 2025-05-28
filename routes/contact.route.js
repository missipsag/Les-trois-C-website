const  express = require('express');
const nodemailer = require ('nodemailer');
const router = express.Router();

router.post('/contact', async(req, res) => {
    const {name, email, phone, type, message} = req.body;
    const transporter = 
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'salledesfeteslecactus@gmail.com',
            pass :'xdrhjdssifutxgri'
        }
    });
    const mailOptions = {
        from: email, 
        to: 'salledesfeteslecactus@gmail.com',
        subject: `New contact inquiry: ${type}`,
        text: `Name: ${name}\nEmail: ${email}\nType: ${type}\nMessage: \n${message}`
    };
    try{
        await transporter.sendMail(mailOptions);
        res.status(200).json({message: 'votre message a été envoyé!'});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:
            "Erreur lors de l'envoie de message"
        });
    }
}
);
module.exports = router;