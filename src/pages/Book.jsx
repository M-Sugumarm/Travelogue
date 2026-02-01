import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips } from '../services/api';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import DetailsModal from '../components/DetailsModal';
import TripBookingModal from '../components/TripBookingModal';
import { FaSearch, FaFilter, FaSortAmountDown, FaMapMarkerAlt, FaGlobeAmericas, FaStar } from 'react-icons/fa';

const filters = {
  duration: ['All', '1-3 Days', '4-7 Days', '8-14 Days', '15+ Days'],
  budget: ['All', 'Under ₹1000', '₹1000-₹2000', '₹2000-₹3000', 'Over ₹3000'],
  difficulty: ['All', 'Easy', 'Moderate', 'Challenging', 'Expert']
};

export default function Book() {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [bookingTrip, setBookingTrip] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    duration: 'All',
    budget: 'All',
    difficulty: 'All'
  });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await getTrips();
      setTrips(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load trips:', error);
      import('../data/trips.json').then(data => {
        const enrichedTrips = (data.default || []).map(t => ({
          ...t,
          // Generate a numeric price if missing, assuming budget is something like "$500" or "€200"
          // Convert roughly to INR (e.g. x 85) for display consistency
          price: t.price || (parseInt(t.budget?.replace(/[^0-9]/g, '') || '0') * 85)
        }));
        setTrips(enrichedTrips);
      });
    } finally {
      setLoading(false);
    }
  };

  const getDurationDays = (duration) => {
    const match = duration?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const filteredTrips = trips.filter(trip => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const searchFields = [trip.title, trip.location, trip.summary, ...(trip.tags || [])].join(' ').toLowerCase();
      if (!searchFields.includes(q)) return false;
    }

    // Duration filter
    if (activeFilters.duration !== 'All') {
      const days = getDurationDays(trip.duration);
      switch (activeFilters.duration) {
        case '1-3 Days': if (days < 1 || days > 3) return false; break;
        case '4-7 Days': if (days < 4 || days > 7) return false; break;
        case '8-14 Days': if (days < 8 || days > 14) return false; break;
        case '15+ Days': if (days < 15) return false; break;
      }
    }

    // Budget filter
    if (activeFilters.budget !== 'All') {
      const price = trip.price || parseInt(trip.budget?.replace(/[^0-9]/g, '')) || 0;
      switch (activeFilters.budget) {
        case 'Under ₹1000': if (price >= 1000) return false; break;
        case '₹1000-₹2000': if (price < 1000 || price > 2000) return false; break;
        case '₹2000-₹3000': if (price < 2000 || price > 3000) return false; break;
        case 'Over ₹3000': if (price <= 3000) return false; break;
      }
    }

    return true;
  });

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    const priceA = a.price || parseInt(a.budget?.replace(/[^0-9]/g, '')) || 0;
    const priceB = b.price || parseInt(b.budget?.replace(/[^0-9]/g, '')) || 0;

    switch (sortBy) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'rating': return (b.rating || 4.5) - (a.rating || 4.5);
      case 'name': return a.title.localeCompare(b.title);
      default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({ ...prev, [type]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({ duration: 'All', budget: 'All', difficulty: 'All' });
    setSearch('');
    setSortBy('featured');
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== 'All') || search;

  const handleBook = (trip) => {
    setSelected(null);
    setBookingTrip(trip);
  };

  const handleBookingSuccess = () => {
    setBookingTrip(null);
    showToast('Booking confirmed! Check your email.', 'success');
  };

  return (
    <div className="book-page destinations-page">
      {/* Hero Header */}
      <section className="page-hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">
              <FaGlobeAmericas /> Explore the World
            </span>
            <h1>Find Your Perfect <span className="gradient-text">Destination</span></h1>
            <p className="hero-subtitle">
              Browse our handpicked collection of extraordinary travel experiences
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="search-filter-bar">
            <div className="search-box large">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations, countries, or experiences..."
              />
              {search && <button className="clear-search" onClick={() => setSearch('')}>×</button>}
            </div>

            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
              {hasActiveFilters && <span className="filter-badge" />}
            </button>

            <div className="sort-dropdown">
              <FaSortAmountDown />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              {Object.entries(filters).map(([type, options]) => (
                <div key={type} className="filter-group">
                  <label>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  <div className="filter-options">
                    {options.map(opt => (
                      <button
                        key={opt}
                        className={`filter-chip ${activeFilters[type] === opt ? 'active' : ''}`}
                        onClick={() => handleFilterChange(type, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="results-section">
        <div className="container">
          <div className="results-header">
            <p className="results-count">
              <FaMapMarkerAlt /> {sortedTrips.length} destinations found
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p>Discovering amazing destinations...</p>
            </div>
          ) : sortedTrips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No destinations found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="trips-grid">
              {sortedTrips.map(trip => (
                <Card
                  key={trip.tripId || trip.id}
                  trip={trip}
                  onOpen={() => setSelected(trip)}
                  favored={isFavorite(trip.tripId || trip.id)}
                  onToggleFav={() => toggleFavorite(trip.tripId || trip.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>


      {selected && <DetailsModal trip={selected} onClose={() => setSelected(null)} onBook={() => handleBook(selected)} />}

      {
        bookingTrip && (
          <TripBookingModal
            trip={bookingTrip}
            onClose={() => setBookingTrip(null)}
            onSuccess={handleBookingSuccess}
          />
        )
      }
    </div >
  );
}
