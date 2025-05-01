const {getUsers} = require("../models/UserModels")

// #TODOS : 
 
// ! ADD CRUD FOR USERS 
//! ADD TRIGGERS FOR USERS

getUsersData = async (req, res) => {
    try {
        let data = await getUsers();
        return data;
    } catch (err) {
        res.json({msg : err, data})
    }
}