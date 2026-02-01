const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// GET /api/trips - Get all trips with filtering
router.get('/', async (req, res) => {
    try {
        const {
            search,
            tags,
            minPrice,
            maxPrice,
            duration,
            sort = '-createdAt',
            limit = 50
        } = req.query;

        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Tags filter
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim());
            query.tags = { $in: tagArray };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Duration filter
        if (duration) {
            query.duration = { $regex: duration, $options: 'i' };
        }

        const trips = await Trip.find(query)
            .sort(sort)
            .limit(Number(limit));

        res.json({
            success: true,
            count: trips.length,
            data: trips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/trips/featured - Get featured trips
router.get('/featured', async (req, res) => {
    try {
        const trips = await Trip.find({ featured: true })
            .sort('-rating')
            .limit(6);

        // If no featured trips, return top-rated
        if (trips.length === 0) {
            const topRated = await Trip.find()
                .sort('-rating')
                .limit(6);
            return res.json({ success: true, data: topRated });
        }

        res.json({ success: true, data: trips });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trips/popular - Get popular destinations
router.get('/popular', async (req, res) => {
    try {
        const trips = await Trip.find()
            .sort('-reviewCount -rating')
            .limit(8);

        res.json({ success: true, data: trips });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trips/tags - Get all unique tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await Trip.distinct('tags');
        res.json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trips/:id - Get single trip by tripId
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findOne({ tripId: req.params.id });

        if (!trip) {
            return res.status(404).json({
                success: false,
                error: 'Trip not found'
            });
        }

        res.json({ success: true, data: trip });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trips/:id/similar - Get similar trips
router.get('/:id/similar', async (req, res) => {
    try {
        const trip = await Trip.findOne({ tripId: req.params.id });

        if (!trip) {
            return res.status(404).json({ success: false, error: 'Trip not found' });
        }

        const similar = await Trip.find({
            tripId: { $ne: trip.tripId },
            $or: [
                { tags: { $in: trip.tags } },
                { location: { $regex: trip.location.split(',')[0], $options: 'i' } }
            ]
        }).limit(4);

        res.json({ success: true, data: similar });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ADMIN ROUTES ============

// Admin email whitelist
const ADMIN_EMAILS = ['sugus7215@gmail.com'];

// Admin check middleware
const isAdmin = (req, res, next) => {
    const adminEmail = req.headers['x-admin-email'];

    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }

    next();
};

// POST /api/trips - Create new trip (Admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        const tripData = req.body;

        // Generate tripId if not provided
        if (!tripData.tripId) {
            tripData.tripId = `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        const trip = new Trip(tripData);
        await trip.save();

        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            data: trip
        });
    } catch (error) {
        console.error('Create Trip Error:', error);
        res.status(500).json({ success: false, error: error.message, details: error.errors });
    }
});

// PUT /api/trips/:id - Update trip (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { tripId: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!trip) {
            return res.status(404).json({
                success: false,
                error: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip updated successfully',
            data: trip
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/trips/:id - Delete trip (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ tripId: req.params.id });

        if (!trip) {
            return res.status(404).json({
                success: false,
                error: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip deleted successfully',
            data: { tripId: req.params.id }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

