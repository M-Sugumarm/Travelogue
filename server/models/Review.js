const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    tripId: {
        type: String,
        required: true
    },
    // Reviewer
    author: {
        name: { type: String, required: true },
        email: { type: String },
        avatar: { type: String }
    },
    // Review Content
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    // Trip Experience
    travelDate: {
        type: Date
    },
    tripAspects: {
        accommodation: { type: Number, min: 1, max: 5 },
        activities: { type: Number, min: 1, max: 5 },
        food: { type: Number, min: 1, max: 5 },
        guide: { type: Number, min: 1, max: 5 },
        value: { type: Number, min: 1, max: 5 }
    },
    // Engagement
    helpful: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update trip rating after review is saved
reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const Trip = mongoose.model('Trip');

    const stats = await Review.aggregate([
        { $match: { tripId: this.tripId } },
        {
            $group: {
                _id: '$tripId',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Trip.findOneAndUpdate(
            { tripId: this.tripId },
            {
                rating: Math.round(stats[0].avgRating * 10) / 10,
                reviewCount: stats[0].count
            }
        );
    }
});

module.exports = mongoose.model('Review', reviewSchema);
