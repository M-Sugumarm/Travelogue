import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaUsers, FaAward, FaHeart, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaInstagram, FaQuoteLeft, FaStar, FaPlane, FaShieldAlt, FaHeadset, FaLeaf } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    image: '/sarah_chen.png',
    bio: 'Former travel journalist with 15+ years exploring 80+ countries.',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Marcus Thompson',
    role: 'Head of Experiences',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    bio: 'Adventure guide turned curator of unforgettable journeys.',
    social: { linkedin: '#', instagram: '#' }
  },
  {
    name: 'Priya Sharma',
    role: 'Travel Curator',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    bio: 'Expert in cultural immersion and authentic local experiences.',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'James Wilson',
    role: 'Operations Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    bio: 'Ensures every trip runs smoothly from booking to return.',
    social: { linkedin: '#', instagram: '#' }
  }
];

const values = [
  {
    icon: <FaHeart />,
    title: 'Passion for Travel',
    description: 'We live and breathe travel. Our team has collectively visited over 150 countries.',
    color: '#ef4444'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Safety First',
    description: '24/7 support, vetted partners, and comprehensive travel insurance options.',
    color: '#3b82f6'
  },
  {
    icon: <FaLeaf />,
    title: 'Sustainable Tourism',
    description: 'Carbon-neutral trips and partnerships with eco-conscious local businesses.',
    color: '#22c55e'
  },
  {
    icon: <FaHeadset />,
    title: 'Always Available',
    description: 'Expert travel advisors ready to help before, during, and after your trip.',
    color: '#8b5cf6'
  }
];

const milestones = [
  { year: '2015', title: 'Founded', desc: 'Started with a vision to make travel accessible' },
  { year: '2018', title: '10K Travelers', desc: 'Milestone of 10,000 happy adventurers' },
  { year: '2021', title: 'Global Expansion', desc: 'Expanded to 50+ destinations worldwide' },
  { year: '2024', title: 'Award Winning', desc: 'Named Best Travel Platform by Travel Weekly' }
];

const testimonials = [
  {
    name: 'Emma Rodriguez',
    location: 'New York, USA',
    rating: 5,
    text: 'Travelogue turned our honeymoon into an absolute dream. Every detail was perfect!',
    trip: 'Bali Paradise'
  },
  {
    name: 'David Kim',
    location: 'Toronto, Canada',
    rating: 5,
    text: 'The Japan trip exceeded all expectations. The local guides were incredibly knowledgeable.',
    trip: 'Japan Cherry Blossom'
  },
  {
    name: 'Sophie Martin',
    location: 'London, UK',
    rating: 5,
    text: 'Professional, responsive, and they truly care about creating memorable experiences.',
    trip: 'Safari Adventure'
  }
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80" alt="" />
          <div className="hero-overlay" />
        </div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">
              <FaPlane /> Est. 2015
            </span>
            <h1>Crafting Unforgettable<br /><span className="gradient-text">Travel Experiences</span></h1>
            <p className="hero-subtitle">
              We're not just a travel company. We're storytellers, adventure architects,
              and memory makers dedicated to transforming your travel dreams into reality.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">50+</span>
                <span className="stat-label">Destinations</span>
              </div>
              <div className="stat">
                <span className="stat-value">25K+</span>
                <span className="stat-label">Happy Travelers</span>
              </div>
              <div className="stat">
                <span className="stat-value">4.9</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <span className="section-label">Our Mission</span>
              <h2>Making the World More Accessible, One Trip at a Time</h2>
              <p>
                At Travelogue, we believe that travel has the power to transform lives.
                It opens minds, creates connections, and builds understanding across cultures.
              </p>
              <p>
                We carefully curate each itinerary, working with local experts to create
                authentic experiences that go beyond typical tourism. From hidden gems
                to iconic landmarks, we design journeys that leave lasting impressions.
              </p>
              <Link to="/book" className="btn-primary">
                Start Your Journey
              </Link>
            </div>
            <div className="mission-images">
              <div className="mission-image main">
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80" alt="Travel adventure" />
              </div>
              <div className="mission-image secondary">
                <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&q=80" alt="Travel experience" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">What Drives Us</span>
            <h2>Our Core Values</h2>
            <p className="section-subtitle">The principles that guide every journey we create</p>
          </div>
          <div className="values-grid">
            {values.map((value, i) => (
              <div key={i} className="value-card" style={{ '--value-color': value.color }}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Our Story</span>
            <h2>The Journey So Far</h2>
          </div>
          <div className="timeline">
            {milestones.map((milestone, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-marker">
                  <span className="year">{milestone.year}</span>
                </div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">The Explorers</span>
            <h2>Meet Our Team</h2>
            <p className="section-subtitle">Passionate travelers dedicated to crafting your perfect adventure</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <div key={i} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className="member-social">
                    {member.social.linkedin && <a href={member.social.linkedin}><FaLinkedin /></a>}
                    {member.social.twitter && <a href={member.social.twitter}><FaTwitter /></a>}
                    {member.social.instagram && <a href={member.social.instagram}><FaInstagram /></a>}
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <span className="member-role">{member.role}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">What Travelers Say</span>
            <h2>Stories from the Road</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <div className="testimonial-rating">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} />)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div>
                    <strong>{t.name}</strong>
                    <span className="author-location">
                      <FaMapMarkerAlt /> {t.location}
                    </span>
                  </div>
                  <span className="author-trip">{t.trip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Your Story?</h2>
            <p>Let's plan your next unforgettable adventure together.</p>
            <div className="cta-buttons">
              <Link to="/book" className="btn-primary large">Explore Destinations</Link>
              <Link to="/contact" className="btn-secondary large">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
