import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const TripCard = ({ trip, isFavorite, onToggleFavorite }) => {
  const openTripPage = () => {
    // Open the trip detail/booking page in a new tab
    const url = `/trip/${trip.id}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="trip-card interactive">
      <div className="trip-image">
        <img src={trip.image} alt={trip.title} />
        <button 
          className="favorite-btn"
          onClick={() => onToggleFavorite(trip.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        <div className="trip-price">{trip.budget}</div>
      </div>
      <div className="trip-info">
        <h3>{trip.title}</h3>
        <p className="location">{trip.location}</p>
        <p className="duration">{trip.duration}</p>
        <p className="summary">{trip.summary || ''}</p>
        <div className="tags">
          {trip.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <button className="book-btn" onClick={openTripPage}>Book Now</button>
      </div>
    </div>
  );
};

export default TripCard;