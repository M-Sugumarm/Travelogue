const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    tripId: {
        type: String,
        required: true
    },
    tripTitle: {
        type: String,
        required: true
    },
    tripImage: {
        type: String
    },
    // Customer Details
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String }
    },
    // Booking Details
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    travelers: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    // Options
    accommodation: {
        type: String,
        enum: ['standard', 'comfort', 'luxury'],
        default: 'standard'
    },
    flightNeeded: {
        type: Boolean,
        default: false
    },
    insurance: {
        type: Boolean,
        default: false
    },
    addOns: [{
        name: String,
        price: Number
    }],
    // Pricing
    basePrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    // Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'paid'
    },
    userId: {
        type: String,
        index: true
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate booking ID before save
bookingSchema.pre('save', function (next) {
    if (!this.bookingId) {
        this.bookingId = 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
