const { promiseConnection } = require("../config/db");

// #TODOS : 
 
// ! ADD CRUD FOR USERS 
//! ADD TRIGGERS FOR USERS

module.exports.getUsers = async () => {
    let query = "select * from users";
    const data = await promiseConnection(query);
    return data;
} 

module.exports.getUserByEmail = async (email) => {
    const query = ` SELECT * FROM users ` 
        + `WHERE email = '${email}';`
    
    const foundUser = await promiseConnection(query);
    return foundUser;
}

module.exports.createUser = async function (userId,  firstName, lastName, email, NID, phone, role = 'user') {
    try{
        const query = `INSERT INTO users VALUES ('${userId}', '${firstName}', '${lastName}', '${email}', '${NID}', '${phone}', '${role}');`; 
        const createdUser = await promiseConnection(query);
        return createdUser;
    } catch (err) { 
        new Error("Failed to add new user to database.");
        return;
    }
}

module.exports.updateUserById = async (Id, firstName, lastName, email, phone) => {
    const query = ` UPDATE TABLE users SET`
        + `firstName = ${firstName}`
        + `lastName = ${lastName}`
        + `email = ${email}`
        + `phone = ${phone}`
        + `WHERE userId = ${Id};`
    
    const updatedUser = await promiseConnection(query);
    return updatedUser;
}