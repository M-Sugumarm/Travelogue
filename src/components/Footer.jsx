import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    destinations: [
      { label: 'Europe', path: '/book?region=europe' },
      { label: 'Asia', path: '/book?region=asia' },
      { label: 'Americas', path: '/book?region=americas' },
      { label: 'Africa', path: '/book?region=africa' },
      { label: 'Oceania', path: '/book?region=oceania' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Team', path: '/about#team' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
      { label: 'Blog', path: '/blog' },
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQs', path: '/contact#faq' },
      { label: 'Booking Guide', path: '/guide' },
      { label: 'Travel Insurance', path: '/insurance' },
    ],
    legal: [
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Refund Policy', path: '/refunds' },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
    { icon: <FaYoutube />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand-link">
              <div className="brand-icon">
                <FaPlane />
              </div>
              <span className="brand-text">Travelogue</span>
            </Link>
            <p className="brand-tagline">
              Crafting unforgettable travel experiences since 2015. Your adventure starts here.
            </p>
            <div className="footer-contact">
              <a href="mailto:hello@travelogue.com">
                <FaEnvelope /> hello@travelogue.com
              </a>
              <a href="tel:+15551234567">
                <FaPhone /> +1 (555) 123-4567
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Destinations</h4>
              <ul>
                {footerLinks.destinations.map(link => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                {footerLinks.company.map(link => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                {footerLinks.support.map(link => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                {footerLinks.legal.map(link => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4>Stay Inspired</h4>
            <p>Subscribe for exclusive deals and travel inspiration</p>
          </div>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Travelogue. All rights reserved.</p>
            <p className="made-with">
              Made with <FaHeart className="heart" /> for travelers worldwide
            </p>
          </div>

          <div className="footer-social">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="social-link"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
