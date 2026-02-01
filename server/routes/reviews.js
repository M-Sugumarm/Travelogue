const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Trip = require('../models/Trip');

// POST /api/reviews - Create new review
router.post('/', async (req, res) => {
    try {
        const {
            tripId,
            name,
            email,
            rating,
            title,
            content,
            travelDate,
            tripAspects
        } = req.body;

        // Find the trip
        const trip = await Trip.findOne({ tripId });
        if (!trip) {
            return res.status(404).json({
                success: false,
                error: 'Trip not found'
            });
        }

        // Create review
        const review = new Review({
            trip: trip._id,
            tripId,
            author: {
                name,
                email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            },
            rating,
            title,
            content,
            travelDate: travelDate ? new Date(travelDate) : null,
            tripAspects
        });

        await review.save();

        res.status(201).json({
            success: true,
            data: review,
            message: 'Review submitted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/reviews/:tripId - Get reviews for a trip
router.get('/:tripId', async (req, res) => {
    try {
        const { sort = '-createdAt', limit = 20 } = req.query;

        const reviews = await Review.find({ tripId: req.params.tripId })
            .sort(sort)
            .limit(Number(limit));

        // Calculate stats
        const stats = await Review.aggregate([
            { $match: { tripId: req.params.tripId } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 },
                    ratings: { $push: '$rating' }
                }
            }
        ]);

        // Rating distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        if (stats.length > 0) {
            stats[0].ratings.forEach(r => {
                distribution[Math.floor(r)] = (distribution[Math.floor(r)] || 0) + 1;
            });
        }

        res.json({
            success: true,
            count: reviews.length,
            stats: stats.length > 0 ? {
                avgRating: Math.round(stats[0].avgRating * 10) / 10,
                totalReviews: stats[0].count,
                distribution
            } : null,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/reviews - Get recent reviews (for homepage)
router.get('/', async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const reviews = await Review.find({ rating: { $gte: 4 } })
            .sort('-createdAt')
            .limit(Number(limit))
            .populate('trip', 'title image location');

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post('/:id/helpful', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpful: 1 } },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
