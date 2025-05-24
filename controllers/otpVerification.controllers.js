const {promiseConnection} = require("../config/db");


module.exports.createVerification = async function (verificationId, email, hashedOtp, expiresAt, used = false) {
   
    try {
       console.log(expiresAt)
        const insertVerficationQuery = "INSERT INTO otpVerifications VALUES "
       + `('${verificationId}', '${email}', '${hashedOtp}', '${expiresAt}', ${used? 1 : 0});`;
   
    console.log("##### Inside createVerification.")
    console.log(promiseConnection)
    
    const newVerification = await promiseConnection(insertVerficationQuery);
    
    console.log("new verification " + newVerification)
    
    if (!newVerification) {
        console.log("ERROR : failed to add verification to database.");
        return;
    };

        return newVerification;
   } catch (err) {
       console.log(err);
    }

}


module.exports.deleteVerification = async function (email) {
    const query = `DELETE FROM otpVerifications WHERE email = ${email} ;`;
    const deletedVerification = await promiseConnection(query);

    if (!deletedVerification) {
        console.log("ERROR : failed to delete verification in database.");
        return;
    }

    return deletedVerification;
}



module.exports.getVerification = async function (email) {
    const query = "SELECT * FROM otpVerifications WHERE "
        + `email =  ${email} AND expiresAt > ${new Date().toISOString().slice(0, 19).replace('T', ' ')};`;
    
    const foundVerification = await promiseConnection(query); 

    if (!foundVerification) {
        console.log("ERROR : No valid verification found in database.");
        return;
    } 
    return foundVerification;
}