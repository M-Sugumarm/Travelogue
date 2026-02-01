import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTripById, getSimilarTrips, getTripReviews } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import TripBookingModal from '../components/TripBookingModal';
import ReviewSection from '../components/ReviewSection';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaHeart, FaRegHeart, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaShieldAlt, FaHeadset, FaArrowLeft } from 'react-icons/fa';

export default function Trip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const { isAuthenticated, user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [similarTrips, setSimilarTrips] = useState([]);
  const [reviews, setReviews] = useState({ data: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadTripData();
    window.scrollTo(0, 0);
  }, [tripId]);

  const loadTripData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tripRes, similarRes, reviewsRes] = await Promise.all([
        getTripById(tripId),
        getSimilarTrips(tripId).catch(() => ({ data: [] })),
        getTripReviews(tripId).catch(() => ({ data: [], stats: {} }))
      ]);

      if (tripRes.data) {
        setTrip(tripRes.data);
      } else {
        setError('Trip not found');
      }

      setSimilarTrips(similarRes.data || []);
      setReviews(reviewsRes.data || { data: [], stats: {} });
    } catch (err) {
      console.error('Failed to load trip:', err);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    setShowBooking(true);
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    showToast('Booking confirmed! Check your email for details.', 'success');
    loadTripData(); // Refresh availability
  };

  const images = trip?.images?.length ? trip.images : [trip?.image].filter(Boolean);

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="trip-page loading">
        <div className="container">
          <div className="loading-state">
            <div className="loader" />
            <p>Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="trip-page error">
        <div className="container">
          <div className="error-state">
            <h2>😕 {error || 'Trip not found'}</h2>
            <p>We couldn't find the trip you're looking for.</p>
            <Link to="/book" className="btn-primary">Browse All Trips</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-page">
      {/* Hero Image Gallery */}
      <section className="trip-hero">
        <div className="gallery">
          <div
            className="gallery-main"
            style={{ backgroundImage: `url(${images[activeImage]})` }}
          >
            <div className="gallery-overlay" />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>
                  <FaChevronLeft />
                </button>
                <button className="gallery-nav next" onClick={nextImage}>
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="gallery-counter">
              {activeImage + 1} / {images.length}
            </div>

            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>

            {/* Favorite Button */}
            <button
              className={`fav-btn large ${isFavorite(trip.tripId) ? 'active' : ''}`}
              onClick={() => toggleFavorite(trip.tripId)}
            >
              {isFavorite(trip.tripId) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  className={`thumb ${i === activeImage ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="trip-content">
        <div className="container">
          <div className="trip-grid">
            {/* Left Column - Details */}
            <div className="trip-details">
              {/* Header */}
              <div className="trip-header">
                <div className="trip-meta">
                  <span><FaMapMarkerAlt /> {trip.location}</span>
                  <span><FaClock /> {trip.duration}</span>
                  <span><FaUsers /> Max {trip.groupSize || 15} people</span>
                </div>
                <h1>{trip.title}</h1>
                <div className="trip-rating">
                  <div className="stars">
                    <FaStar /> {trip.rating?.toFixed(1) || '4.5'}
                  </div>
                  <span>({trip.reviewCount || 0} reviews)</span>
                  {trip.difficulty && (
                    <span className="difficulty">{trip.difficulty}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="section">
                <h2>About This Trip</h2>
                <p className="description">
                  {trip.description || trip.summary}
                </p>
              </div>

              {/* Highlights */}
              {trip.highlights?.length > 0 && (
                <div className="section">
                  <h2>Highlights</h2>
                  <ul className="highlights-list">
                    {trip.highlights.map((h, i) => (
                      <li key={i}><FaCheck className="icon" /> {h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Itinerary */}
              {trip.itinerary?.length > 0 && (
                <div className="section">
                  <h2>Itinerary</h2>
                  <div className="itinerary">
                    {trip.itinerary.map((day, i) => (
                      <div key={i} className="itinerary-day">
                        <div className="day-marker">
                          <span className="day-num">Day {day.day || i + 1}</span>
                          <div className="day-line" />
                        </div>
                        <div className="day-content">
                          <h3>{day.title}</h3>
                          <p>{day.description}</p>
                          {day.activities && (
                            <ul className="activities">
                              {day.activities.map((a, j) => (
                                <li key={j}>{a}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included / Not Included */}
              <div className="section inclusions">
                <div className="row">
                  {trip.included?.length > 0 && (
                    <div className="col">
                      <h3>What's Included</h3>
                      <ul className="included-list">
                        {trip.included.map((item, i) => (
                          <li key={i}><FaCheck className="icon success" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {trip.notIncluded?.length > 0 && (
                    <div className="col">
                      <h3>Not Included</h3>
                      <ul className="not-included-list">
                        {trip.notIncluded.map((item, i) => (
                          <li key={i}><FaTimes className="icon danger" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <ReviewSection
                tripId={trip.tripId}
                reviews={reviews.data}
                stats={reviews.stats}
                onReviewAdded={loadTripData}
              />
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="trip-sidebar">
              <div className="booking-card">
                <div className="price">
                  <span className="amount">${trip.price?.toLocaleString()}</span>
                  <span className="per">/ person</span>
                </div>

                <div className="availability">
                  {trip.spotsAvailable > 0 ? (
                    <>
                      <span className="available">
                        {trip.spotsAvailable} spots left
                      </span>
                      <div className="spots-bar">
                        <div
                          className="spots-fill"
                          style={{
                            width: `${((trip.maxSpots - trip.spotsAvailable) / trip.maxSpots) * 100}%`
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <span className="sold-out">Sold Out</span>
                  )}
                </div>

                {trip.startDates?.length > 0 && (
                  <div className="dates">
                    <h4><FaCalendarAlt /> Available Dates</h4>
                    <div className="date-chips">
                      {trip.startDates.slice(0, 3).map((d, i) => (
                        <span key={i} className="date-chip">
                          {new Date(d).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      ))}
                      {trip.startDates.length > 3 && (
                        <span className="date-chip more">
                          +{trip.startDates.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="btn-primary book-btn"
                  onClick={handleBookNow}
                  disabled={trip.spotsAvailable === 0}
                >
                  {trip.spotsAvailable > 0 ? 'Book Now' : 'Sold Out'}
                </button>

                <div className="guarantees">
                  <div className="guarantee">
                    <FaShieldAlt />
                    <span>Free cancellation up to 24h before</span>
                  </div>
                  <div className="guarantee">
                    <FaHeadset />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Trips */}
      {similarTrips.length > 0 && (
        <section className="similar-section">
          <div className="container">
            <h2>You Might Also Like</h2>
            <div className="similar-grid">
              {similarTrips.slice(0, 4).map(t => (
                <Link key={t.tripId} to={`/trip/${t.tripId}`} className="similar-card">
                  <div
                    className="similar-image"
                    style={{ backgroundImage: `url(${t.image})` }}
                  >
                    <div className="similar-price">${t.price}</div>
                  </div>
                  <div className="similar-info">
                    <h4>{t.title}</h4>
                    <span className="similar-meta">
                      <FaMapMarkerAlt /> {t.location}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <TripBookingModal
          trip={trip}
          onClose={() => setShowBooking(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
