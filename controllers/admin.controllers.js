// Import necessary modules
const  User = require('../models/UserModels');
const  Reservation  = require('../models/ReservationModel');
const  Review  = require('../models/ReviewModel');
const db = require('../config/db');

// Controller for managing admin-related operations
const adminController = {
    // Fetch all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    // Fetch all reservations
    getAllReservations: async (req, res) => {
        try {
            const reservations = await Reservation.findAll();
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reservations' });
        }
    },

    // Fetch all reviews
    getAllReviews: async (req, res) => {
        try {
            const reviews = await Review.findAll();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    },

    // Delete a user by ID
    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            await User.destroy({ where: { id } });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    },

    // Delete a reservation by ID
    deleteReservation: async (req, res) => {
        const { id } = req.params;
        try {
            await Reservation.destroy({ where: { id } });
            res.status(200).json({ message: 'Reservation deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete reservation' });
        }
    },

    // Delete a review by ID
    deleteReview: async (req, res) => {
        const { id } = req.params;
        try {
            await Review.destroy({ where: { id } });
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete review' });
        }
    },
};

module.exports = adminController;