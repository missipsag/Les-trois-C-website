const {Review} = require("../models/index");
const { v4: uuidv4 } = require('uuid');
// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { authorLastName, authorFirstName, authorEmail, rating, content } = req.body;
        const newReview = await Review.create({
            reviewId: uuidv4(), // Generate a unique ID for the review
            authorLastName,
            authorFirstName,
            authorEmail,
            rating,
            content, 
            status: 'pending' // Default status
        });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: "Failed to create review", details: error.message });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch review", details: error.message });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        console.log("######Updating review"); 
        const { reviewId } = req.params;
        console.log("Updating review with ID:", reviewId);  
        const review = await Review.findByPk(reviewId);
        if (!review) {
            console.error("Review not found");
        }
        await review.update({ status : 'approved' });
        return res.redirect("/admin");
    } catch (error) {
        console.error("Failed to update review", error);
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        await review.destroy();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review", details: error.message });
    }
};