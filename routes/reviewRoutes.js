const express = require("express");
const {createReview, updateReview, deleteReview} = require("../controllers/review.controllers");
const router = express.Router();    

router.route("/submitReview")   
    .post(createReview);

router.route("/approveReview/:reviewId")
    .post(async (req, res) => {
        res.send("Review approved");
    })

router.route("/refuseReview/:reviewId")
    .delete(deleteReview)

module.exports = router;

