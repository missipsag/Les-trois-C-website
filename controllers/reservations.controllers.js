const {promiseConnection} = require("../config/db.js");


module.exports.createReservation = async function (
    reservationId,
    roomId, 
    userId, 
    reservationDate
) {
    const sql = "INSERT INTO reservations (reservationId, roomId, userId, reservationDate)"
                + `VALUES ('${reservationId}', '${roomId}', '${userId}', '${reservationDate}');`
    
    const createdReservation = await promiseConnection(sql);

    return createdReservation;
}