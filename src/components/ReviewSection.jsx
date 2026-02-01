import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReview } from '../services/api';
import { FaStar, FaRegStar, FaUser, FaThumbsUp, FaChevronDown } from 'react-icons/fa';

export default function ReviewSection({ tripId, reviews = [], stats = {}, onReviewAdded }) {
    const { user, isAuthenticated } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: '',
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createReview({
                tripId,
                ...formData,
                userId: user?.id
            });

            setShowForm(false);
            setFormData({ rating: 5, title: '', comment: '', name: '', email: '' });
            onReviewAdded?.();
        } catch (error) {
            console.error('Review submission failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const visibleReviews = expanded ? reviews : reviews.slice(0, 3);
    const avgRating = stats.averageRating || 4.5;

    return (
        <div className="review-section">
            <div className="section-header">
                <h2>Reviews & Ratings</h2>
                {isAuthenticated && !showForm && (
                    <button className="btn-secondary" onClick={() => setShowForm(true)}>
                        Write a Review
                    </button>
                )}
            </div>

            {/* Rating Summary */}
            <div className="rating-summary">
                <div className="rating-big">
                    <span className="rating-number">{avgRating.toFixed(1)}</span>
                    <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                            i < Math.round(avgRating)
                                ? <FaStar key={i} className="star filled" />
                                : <FaRegStar key={i} className="star" />
                        ))}
                    </div>
                    <span className="rating-count">{reviews.length} reviews</span>
                </div>

                {stats.distribution && (
                    <div className="rating-bars">
                        {[5, 4, 3, 2, 1].map(n => {
                            const count = stats.distribution[n] || 0;
                            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={n} className="bar-row">
                                    <span>{n} star</span>
                                    <div className="bar">
                                        <div className="bar-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Review Form */}
            {showForm && (
                <form className="review-form" onSubmit={handleSubmit}>
                    <h4>Share Your Experience</h4>

                    <div className="star-picker">
                        <label>Your Rating</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    className={n <= formData.rating ? 'filled' : ''}
                                    onClick={() => setFormData(prev => ({ ...prev, rating: n }))}
                                >
                                    {n <= formData.rating ? <FaStar /> : <FaRegStar />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Summarize your experience"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            value={formData.comment}
                            onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Tell others about your trip..."
                            rows={4}
                            required
                        />
                    </div>

                    {!isAuthenticated && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {visibleReviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
                ) : (
                    visibleReviews.map(review => (
                        <div key={review._id || review.reviewId} className="review-card">
                            <div className="review-header">
                                <div className="reviewer">
                                    <div className="avatar">
                                        {review.name?.charAt(0).toUpperCase() || <FaUser />}
                                    </div>
                                    <div>
                                        <strong>{review.name || 'Anonymous'}</strong>
                                        <span className="date">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        i < review.rating
                                            ? <FaStar key={i} className="star filled" />
                                            : <FaRegStar key={i} className="star" />
                                    ))}
                                </div>
                            </div>

                            {review.title && <h5 className="review-title">{review.title}</h5>}
                            <p className="review-text">{review.comment || review.text}</p>

                            <div className="review-footer">
                                <button className="helpful-btn">
                                    <FaThumbsUp /> Helpful ({review.helpfulCount || 0})
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Show More */}
            {reviews.length > 3 && (
                <button className="show-more" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                    <FaChevronDown className={expanded ? 'rotate' : ''} />
                </button>
            )}
        </div>
    );
}
