import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt, FaClock, FaPlay } from 'react-icons/fa';

const heroSlides = [
    {
        id: 1,
        title: "Explore the Wonders of Japan",
        subtitle: "Cherry blossoms, ancient temples & modern marvels",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80",
        location: "Tokyo, Japan",
        duration: "7 Days",
        rating: 4.9,
        price: 2499,
        tripId: "japan-cherry-blossom"
    },
    {
        id: 2,
        title: "Safari Adventure in Kenya",
        subtitle: "Witness the great migration up close",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80",
        location: "Masai Mara, Kenya",
        duration: "5 Days",
        rating: 4.8,
        price: 3299,
        tripId: "kenya-safari"
    },
    {
        id: 3,
        title: "Magical Northern Lights",
        subtitle: "Dance with aurora under Arctic skies",
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80",
        location: "Tromsø, Norway",
        duration: "4 Days",
        rating: 4.9,
        price: 2899,
        tripId: "iceland-aurora"
    },
    {
        id: 4,
        title: "Greek Island Paradise",
        subtitle: "Blue domes, crystal waters & sunset views",
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=80",
        location: "Santorini, Greece",
        duration: "6 Days",
        rating: 4.7,
        price: 1899,
        tripId: "santorini-escape"
    },
    {
        id: 5,
        title: "Peruvian Highlands Trek",
        subtitle: "Walk the ancient path to Machu Picchu",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1920&q=80",
        location: "Cusco, Peru",
        duration: "8 Days",
        rating: 4.9,
        price: 2199,
        tripId: "peru-inca-trail"
    }
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [isTransitioning]);

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [isTransitioning]);

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, nextSlide]);

    const slide = heroSlides[currentSlide];

    return (
        <section
            className="hero-carousel"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Images */}
            <div className="carousel-backgrounds">
                {heroSlides.map((s, i) => (
                    <div
                        key={s.id}
                        className={`carousel-bg ${i === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${s.image})` }}
                    />
                ))}
                <div className="carousel-overlay" />
            </div>

            {/* Content */}
            <div className="carousel-content">
                <div className="carousel-text">
                    <div className="slide-meta">
                        <span className="meta-item">
                            <FaMapMarkerAlt /> {slide.location}
                        </span>
                        <span className="meta-item">
                            <FaClock /> {slide.duration}
                        </span>
                        <span className="meta-item rating">
                            <FaStar /> {slide.rating}
                        </span>
                    </div>

                    <h1 className="slide-title">{slide.title}</h1>
                    <p className="slide-subtitle">{slide.subtitle}</p>

                    <div className="slide-actions">
                        <Link to={`/trip/${slide.tripId}`} className="btn-primary large">
                            Explore Trip — ${slide.price.toLocaleString()}
                        </Link>
                        <button className="btn-secondary large">
                            <FaPlay /> Watch Video
                        </button>
                    </div>
                </div>

                {/* Mini Cards Preview */}
                <div className="carousel-preview">
                    {heroSlides.map((s, i) => (
                        <div
                            key={s.id}
                            className={`preview-card ${i === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(i)}
                        >
                            <div
                                className="preview-image"
                                style={{ backgroundImage: `url(${s.image})` }}
                            />
                            <div className="preview-info">
                                <span className="preview-location">{s.location}</span>
                                <span className="preview-price">${s.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button className="carousel-arrow prev" onClick={prevSlide}>
                <FaChevronLeft />
            </button>
            <button className="carousel-arrow next" onClick={nextSlide}>
                <FaChevronRight />
            </button>

            {/* Dots */}
            <div className="carousel-dots">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(i)}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="carousel-progress">
                <div
                    className="progress-bar"
                    style={{
                        width: `${((currentSlide + 1) / heroSlides.length) * 100}%`
                    }}
                />
            </div>
        </section>
    );
}
