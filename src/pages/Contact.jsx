import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaPaperPlane, FaHeadset, FaComments, FaQuestionCircle, FaCheckCircle, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    title: 'Visit Us',
    lines: ['123 Adventure Street', 'San Francisco, CA 94102', 'United States'],
    color: '#ef4444'
  },
  {
    icon: <FaEnvelope />,
    title: 'Email Us',
    lines: ['hello@travelogue.com', 'support@travelogue.com'],
    color: '#3b82f6'
  },
  {
    icon: <FaPhone />,
    title: 'Call Us',
    lines: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    color: '#22c55e'
  },
  {
    icon: <FaClock />,
    title: 'Working Hours',
    lines: ['Mon - Fri: 9AM - 8PM', 'Sat - Sun: 10AM - 6PM', 'All times in PST'],
    color: '#8b5cf6'
  }
];

const supportOptions = [
  {
    icon: <FaHeadset />,
    title: 'Live Chat',
    description: 'Chat with our travel experts in real-time',
    action: 'Start Chat',
    available: true
  },
  {
    icon: <FaWhatsapp />,
    title: 'WhatsApp',
    description: 'Message us on WhatsApp for quick responses',
    action: '+1 555 123 4567',
    available: true
  },
  {
    icon: <FaQuestionCircle />,
    title: 'FAQ',
    description: 'Find answers to common questions',
    action: 'View FAQ',
    available: true
  }
];

const faqs = [
  {
    question: 'How do I book a trip?',
    answer: 'Simply browse our destinations, select your preferred trip, choose your dates and travelers, then complete the booking with secure payment.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We offer free cancellation up to 24 hours before the trip start date. After that, a 20% fee applies. Full refunds are available for emergencies.'
  },
  {
    question: 'Are flights included in the price?',
    answer: 'Flights are optional add-ons. You can choose to include round-trip flights during the booking process for an additional cost.'
  },
  {
    question: 'Do you offer travel insurance?',
    answer: 'Yes! We partner with leading insurance providers to offer comprehensive travel insurance that covers cancellations, medical emergencies, and more.'
  }
];

export default function Contact() {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    }, 500);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">
              <FaComments /> We're Here to Help
            </span>
            <h1>Get in <span className="gradient-text">Touch</span></h1>
            <p className="hero-subtitle">
              Have questions about your next adventure? Our travel experts are ready
              to help you plan the perfect trip.
            </p>
          </div>
        </div>
        <div className="hero-pattern" />
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, i) => (
              <div key={i} className="contact-info-card" style={{ '--card-color': info.color }}>
                <div className="card-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                {info.lines.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll respond within 24 hours</p>
              </div>

              {submitted ? (
                <div className="success-message">
                  <FaCheckCircle className="success-icon" />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Question</option>
                        <option value="support">Trip Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your travel plans or questions..."
                      rows={5}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary submit-btn">
                    <FaPaperPlane /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="contact-sidebar">
              {/* Quick Support */}
              <div className="sidebar-section support-options">
                <h3>Need Quick Help?</h3>
                {supportOptions.map((opt, i) => (
                  <div key={i} className="support-card">
                    <div className="support-icon">{opt.icon}</div>
                    <div className="support-info">
                      <h4>{opt.title}</h4>
                      <p>{opt.description}</p>
                    </div>
                    <button className="support-action">{opt.action}</button>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="sidebar-section social-links">
                <h3>Follow Us</h3>
                <p>Stay updated with travel tips and exclusive deals</p>
                <div className="social-grid">
                  <a href="#" className="social-link facebook"><FaFacebook /></a>
                  <a href="#" className="social-link twitter"><FaTwitter /></a>
                  <a href="#" className="social-link instagram"><FaInstagram /></a>
                  <a href="#" className="social-link linkedin"><FaLinkedin /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${expandedFaq === i ? 'expanded' : ''}`}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <div className="faq-question">
                  <h4>{faq.question}</h4>
                  <span className="faq-toggle">{expandedFaq === i ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="map-wrapper">
            <div className="map-overlay">
              <h3>Visit Our Office</h3>
              <p>123 Adventure Street, San Francisco, CA</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Get Directions
              </a>
            </div>
            <div className="map-placeholder">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80"
                alt="San Francisco"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
