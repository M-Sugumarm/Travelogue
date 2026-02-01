import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaClock, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function Card({ trip, onOpen, favored, onToggleFav }) {
  const {
    tripId,
    id,
    title,
    location,
    duration,
    budget,
    price,
    image,
    summary,
    rating = 4.5,
    reviewCount = 0,
    spotsAvailable,
    tags = []
  } = trip;

  const displayPrice = budget || `₹${price?.toLocaleString('en-IN')}`;
  const identifier = tripId || id;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFav?.();
  };

  return (
    <div className="trip-card" onClick={onOpen}>
      {/* Image Section */}
      <div
        className="card-media"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Overlay */}
        <div className="card-overlay" />

        {/* Top badges */}
        <div className="card-badges">
          <span className="badge rating">
            <FaStar /> {rating.toFixed(1)}
          </span>
          {spotsAvailable !== undefined && spotsAvailable <= 5 && (
            <span className="badge spots">
              {spotsAvailable} spots left
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          className={`fav-btn ${favored ? 'active' : ''}`}
          onClick={handleFavorite}
        >
          {favored ? <FaHeart /> : <FaRegHeart />}
        </button>

        {/* Price tag */}
        <div className="card-price">
          {displayPrice}
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content">
        <div className="card-meta">
          <span><FaMapMarkerAlt /> {location}</span>
          <span><FaClock /> {duration}</span>
        </div>

        <h3 className="card-title">{title}</h3>

        <p className="card-summary">{summary}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            {tags.length > 3 && (
              <span className="tag more">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <Link
            to={`/trip/${identifier}`}
            className="view-details"
            onClick={e => e.stopPropagation()}
          >
            View Details <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
