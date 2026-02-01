import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, getFeaturedTrips, getPopularTrips } from '../services/api';
import { useApp } from '../context/AppContext';
import HeroCarousel from '../components/HeroCarousel';
import Card from '../components/Card';
import DetailsModal from '../components/DetailsModal';
import { FaSearch, FaStar, FaGlobeAmericas, FaUsers, FaMapMarkedAlt, FaArrowRight, FaCompass, FaMountain, FaUmbrellaBeach, FaCity, FaHiking, FaHeart } from 'react-icons/fa';

const categories = [
  { name: 'Adventure', icon: <FaMountain />, color: '#ef4444' },
  { name: 'Beach', icon: <FaUmbrellaBeach />, color: '#06b6d4' },
  { name: 'City', icon: <FaCity />, color: '#8b5cf6' },
  { name: 'Nature', icon: <FaCompass />, color: '#22c55e' },
  { name: 'Hiking', icon: <FaHiking />, color: '#f59e0b' },
  { name: 'Romantic', icon: <FaHeart />, color: '#ec4899' },
];

export default function Home() {
  const { isFavorite, toggleFavorite } = useApp();
  const [trips, setTrips] = useState([]);
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [popularTrips, setPopularTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const [tripsRes, featuredRes, popularRes] = await Promise.all([
        getTrips(),
        getFeaturedTrips(),
        getPopularTrips().catch(() => ({ data: [] }))
      ]);
      // Handle nested API response: fetchAPI returns {data: serverResponse}
      // Server returns {success: true, data: [...]}
      // So actual trips array is at res.data.data or res.data (depending on structure)
      const extractArray = (res) => {
        if (Array.isArray(res)) return res;
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      };

      setTrips(extractArray(tripsRes));
      setFeaturedTrips(extractArray(featuredRes));
      setPopularTrips(extractArray(popularRes));
    } catch (error) {
      console.error('Failed to load trips:', error);
      import('../data/trips.json').then(data => {
        const rawTrips = Array.isArray(data.default) ? data.default : [];
        const normalizedTrips = rawTrips.map(t => ({
          ...t,
          price: t.price || (parseInt(t.budget?.replace(/[^0-9]/g, '') || '0') * 85)
        }));
        setTrips(normalizedTrips);
        setFeaturedTrips(normalizedTrips.slice(0, 6));
      }).catch(() => {
        setTrips([]);
        setFeaturedTrips([]);
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = (Array.isArray(trips) ? trips : []).filter(trip => {
    const matchesQuery = !query.trim() || [
      trip.title,
      trip.location,
      trip.summary,
      ...(trip.tags || [])
    ].join(' ').toLowerCase().includes(query.toLowerCase());

    const matchesCategory = !activeCategory ||
      (trip.tags || []).some(tag => tag.toLowerCase() === activeCategory.toLowerCase());

    return matchesQuery && matchesCategory;
  });

  const stats = [
    { icon: <FaGlobeAmericas />, value: '50+', label: 'Destinations' },
    { icon: <FaMapMarkedAlt />, value: '200+', label: 'Itineraries' },
    { icon: <FaUsers />, value: '10K+', label: 'Happy Travelers' },
    { icon: <FaStar />, value: '4.8', label: 'Avg Rating' },
  ];

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Explore by Category</h2>
              <p className="section-subtitle">Find your perfect adventure type</p>
            </div>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`category-card ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-icon">{cat.icon}</div>
                <span className="category-name">{cat.name}</span>
                <div className="category-glow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search destinations, countries, or experiences..."
              />
              {query && (
                <button className="clear-search" onClick={() => setQuery('')}>×</button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>✨ Featured Destinations</h2>
              <p className="section-subtitle">Handpicked experiences you'll love</p>
            </div>
            <Link to="/explore" className="see-all-link">
              View All <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Discovering amazing destinations...</p>
            </div>
          ) : (
            <div className="featured-grid">
              {(Array.isArray(featuredTrips) ? featuredTrips : []).slice(0, 6).map((trip, i) => (
                <div
                  key={trip.tripId || trip.id}
                  className={`featured-card size-${i === 0 ? 'large' : i < 3 ? 'medium' : 'small'}`}
                  onClick={() => setSelected(trip)}
                >
                  <div
                    className="featured-image"
                    style={{ backgroundImage: `url(${trip.image})` }}
                  >
                    <div className="featured-overlay">
                      <div className="featured-rating">
                        <FaStar /> {trip.rating || 4.5}
                      </div>
                      <div className="featured-content">
                        <h3>{trip.title}</h3>
                        <p>{trip.location}</p>
                        <span className="featured-price">{trip.budget || `$${trip.price}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>
                {activeCategory ? `${activeCategory} Trips` : 'All Destinations'}
                <span className="results-count">({filteredTrips.length} trips)</span>
              </h2>
              <p className="section-subtitle">
                {activeCategory ? `Explore our ${activeCategory.toLowerCase()} adventures` : 'From weekend getaways to epic journeys'}
              </p>
            </div>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No trips found</h3>
              <p>Try a different search or category</p>
              <button className="btn-secondary" onClick={() => { setQuery(''); setActiveCategory(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="trips-grid">
              {filteredTrips.map(trip => (
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready for Your Next Adventure?</h2>
              <p>Join thousands of travelers who've discovered their dream destinations with us.</p>
              <div className="cta-actions">
                <Link to="/book" className="btn-primary large">Start Planning</Link>
                <Link to="/contact" className="btn-secondary large">Talk to Expert</Link>
              </div>
            </div>
            <div className="cta-visual">
              <div className="cta-circle"></div>
              <div className="cta-circle"></div>
              <div className="cta-circle"></div>
            </div>
          </div>
        </div>
      </section>

      {selected && <DetailsModal trip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
