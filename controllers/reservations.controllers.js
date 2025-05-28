const {sequelize, Reservation, User } = require("../models/index")

// Create a new reservation
module.exports.createReservation = async function (req, res) {
    try {
        const { reservationId, roomId, userId, reservationDate, status } = req.body;
        const newReservation = await Reservation.create({
            reservationId,
            roomId,
            userId,
            reservationDate,
            status
        });
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ error: "Failed to create reservation", details: error.message });
    }
};

// Get all reservations
module.exports.getAllReservations = async function (req, res) {
    try {
        const reservations = await Reservation.findAll();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reservations", details: error.message });
    }
};

// Get all pending reservations with user information
module.exports.getPendingReservationsWithUsers = async function () {
    try {
        const pendingReservations = await Reservation.findAll({
            where: { status: 'pending' },
            include: [{
                model: User,
                as: "user"
            }]
        });
        console.log("#### pending reservations : ",pendingReservations)
        return pendingReservations;
    } catch (error) {
        console.log("Failed to fetch pending reservations");
    }
};

// Get a reservation by ID
module.exports.getReservationById = async function (req, res) {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reservation", details: error.message });
    }
};

// Update a reservation
module.exports.updateReservation = async function (req, res) {
    try {
        const { id } = req.params;
        const { roomId, userId, reservationDate, status } = req.body;
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        await reservation.update({ roomId, userId, reservationDate, status });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Failed to update reservation", details: error.message });
    }
};

// Delete a reservation
module.exports.deleteReservation = async function (req, res) {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        await reservation.destroy();
        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete reservation", details: error.message });
    }
};