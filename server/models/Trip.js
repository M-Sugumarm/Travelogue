const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tripId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    tags: [{
        type: String
    }],
    image: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    itinerary: [{
        day: Number,
        title: String,
        description: String
    }],
    highlights: [{
        type: String
    }],
    included: [{
        type: String
    }],
    notIncluded: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    spotsAvailable: {
        type: Number,
        default: 12
    },
    maxSpots: {
        type: Number,
        default: 15
    },
    featured: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging'],
        default: 'Moderate'
    },
    groupSize: {
        min: { type: Number, default: 1 },
        max: { type: Number, default: 15 }
    },
    startDates: [{
        type: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for average rating from reviews
tripSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'trip',
    localField: '_id'
});

tripSchema.set('toJSON', { virtuals: true });
tripSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);
