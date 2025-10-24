import React from 'react'

export default function Contact(){
  return (
    <div className="container contact-page">
      <div className="contact-header">
        <h2>Contact Us</h2>
        <p className="muted">Have a question? Drop us a message and we'll get back to you.</p>
      </div>
      <div className="contact-container">
        <form className="contact-form" onSubmit={(e)=>{ e.preventDefault(); alert('Message sent (demo)') }}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" placeholder="Enter your email" type="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="Tell us about your trip" rows={6} required />
          </div>
          <button className="btn submit-btn" type="submit">
            Send Message
          </button>
        </form>
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p className="muted">Mon-Fri, 9am-6pm EST</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email Us</h3>
            <p>support@travelpro.com</p>
            <p className="muted">We reply within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
