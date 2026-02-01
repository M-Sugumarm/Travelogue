const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { sendEmail } = require('../services/emailService');

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
    try {
        const {
            tripId,
            name,
            email,
            phone,
            startDate,
            travelers,
            accommodation = 'standard',
            flightNeeded = false,
            insurance = false,
            addOns = [],
            userId = null
        } = req.body;

        // Find the trip
        const trip = await Trip.findOne({ tripId });
        if (!trip) {
            return res.status(404).json({
                success: false,
                error: 'Trip not found'
            });
        }

        // Check availability
        if (trip.spotsAvailable < travelers) {
            return res.status(400).json({
                success: false,
                error: `Only ${trip.spotsAvailable} spots available`
            });
        }

        // Calculate pricing
        let basePrice = trip.price * travelers;
        let total = basePrice;

        // Accommodation multiplier
        const accommodationMultipliers = {
            standard: 1,
            comfort: 1.3,
            luxury: 1.8
        };
        total *= accommodationMultipliers[accommodation] || 1;

        // Flight cost (40% extra)
        if (flightNeeded) {
            total += basePrice * 0.4;
        }

        // Insurance (5% of base)
        if (insurance) {
            total += basePrice * 0.05;
        }

        // Add-ons
        addOns.forEach(addon => {
            total += addon.price || 0;
        });

        // Calculate end date based on duration
        const durationDays = parseInt(trip.duration) || 3;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + durationDays);

        // Create booking
        const booking = new Booking({
            bookingId: 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
            trip: trip._id,
            tripId: trip.tripId,
            tripTitle: trip.title,
            tripImage: trip.image,
            customer: { name, email, phone },
            startDate: new Date(startDate),
            endDate,
            travelers,
            accommodation,
            flightNeeded,
            insurance,
            addOns,
            basePrice,
            totalPrice: Math.round(total),
            currency: trip.currency || 'INR',
            userId
        });

        await booking.save();

        // Update trip availability
        trip.spotsAvailable = Math.max(0, trip.spotsAvailable - travelers);
        await trip.save();

        // Send confirmation email
        try {
            await sendEmail(email, 'bookingConfirmation', { booking, trip });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the booking if email fails
        }

        res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking confirmed! Check your email for details.'
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/bookings - Get bookings (by email or userId)
router.get('/', async (req, res) => {
    try {
        const { email, userId } = req.query;

        let query = {};
        if (email) {
            query['customer.email'] = email.toLowerCase();
        }
        if (userId) {
            query.userId = userId;
        }

        const bookings = await Booking.find(query)
            .sort('-createdAt')
            .populate('trip', 'title image location duration');

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.id })
            .populate('trip');

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/bookings/:id/cancel - Cancel booking
router.patch('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                error: 'Booking already cancelled'
            });
        }

        booking.status = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        // Restore trip spots
        const trip = await Trip.findById(booking.trip);
        if (trip) {
            trip.spotsAvailable = Math.min(trip.maxSpots, trip.spotsAvailable + booking.travelers);
            await trip.save();

            // Send cancellation email
            try {
                await sendEmail(booking.customer.email, 'bookingCancellation', { booking, trip });
            } catch (emailError) {
                console.error('Cancellation email failed:', emailError);
            }
        }

        res.json({
            success: true,
            data: booking,
            message: 'Booking cancelled. Refund will be processed within 5-7 business days.'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
