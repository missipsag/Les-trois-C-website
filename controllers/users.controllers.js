const {getUsers} = require("../models/UserModels")

// #TODOS : 
 
// ! ADD CRUD FOR USERS 
//! ADD TRIGGERS FOR USERS

exports.getUsers = async () => {
    let query = "select * from users";
    const data = await promiseConnection(query);
    return data;
} 

exports.getUserById = async (Id) => {
    const query = ` SELECT * FROM users ` 
        + `WHERE userdId = ${Id};`
    
    const foundUser = await promiseConnection(query);
    return foundUser;
}


exports.updateUserById = async (Id, firstName, lastName, email, phone) => {
    const query = ` UPDATE TABLE users SET`
        + `firstName = ${firstName}`
        + `lastName = ${lastName}`
        + `email = ${email}`
        + `phone = ${phone}`
        + `WHERE userId = ${Id};`
    
    const updatedUser = await promiseConnection(query);
    return updatedUser;
}