import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="footer-curve" aria-hidden="true">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="container">
        <div className="footer-top">
          <div className="brand-col">
            <div className="logo">
              <img src={logo} alt="Travelogue" className="site-logo" style={{height:36, verticalAlign:'middle', marginRight:10}} />
              Travelogue
            </div>
            <p className="tagline">Curated trips that inspire wanderlust</p>
            <div className="stats-row">
              <div className="stat">
                <span className="value">12+</span>
                <span className="label">Destinations</span>
              </div>
              <div className="stat">
                <span className="value">24/7</span>
                <span className="label">Support</span>
              </div>
            </div>
          </div>
          
          <div className="footer-grid">
            <div className="col">
              <h4>Explore</h4>
              <nav className="footer-nav">
                <Link to="/explore">Destinations</Link>
                <Link to="/book">Book a Trip</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/about">About Us</Link>
              </nav>
            </div>
            
            <div className="col">
              <h4>Connect</h4>
              <div className="socials">
                <a href="#" className="social-link" aria-label="Twitter">
                  <span className="icon">𝕏</span>
                  <span>Twitter</span>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <span className="icon">📸</span>
                  <span>Instagram</span>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <span className="icon">💼</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            
            <div className="col newsletter">
              <h4>Stay Updated</h4>
              <p className="pitch">Get weekly curated trips and exclusive deals</p>
              <form onSubmit={(e)=>{ e.preventDefault(); alert('Thanks! You\'re subscribed to our newsletter.') }} className="newsletter-form">
                <div className="input-row">
                  <input placeholder="Enter your email" type="email" required />
                  <button className="btn glow" type="submit">
                    <span>Subscribe</span>
                    <span className="icon">→</span>
                  </button>
                </div>
                <label className="consent">
                  <input type="checkbox" required />
                  <span>I agree to receive travel inspiration emails</span>
                </label>
              </form>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            © 2025 Travelogue • Built for ProU Assessment
          </div>
          <nav className="legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
