import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { FaBars, FaTimes, FaHeart, FaBell, FaCog } from 'react-icons/fa'

const ADMIN_EMAIL = 'sugus7215@gmail.com'

// Check if Clerk is properly configured
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isClerkEnabled = CLERK_KEY && CLERK_KEY !== 'YOUR_PUBLISHABLE_KEY' && CLERK_KEY.startsWith('pk_')

export default function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Get user info if Clerk is enabled
  let user = null
  let isAdmin = false

  if (isClerkEnabled) {
    try {
      const userHook = useUser()
      user = userHook.user
      isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    } catch (e) {
      // Clerk not ready
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Destinations' },
    { path: '/book', label: 'Book' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  // Render auth section based on whether Clerk is enabled
  const renderAuthSection = () => {
    if (isClerkEnabled) {
      return (
        <>
          <SignedIn>
            {isAdmin && (
              <Link to="/admin" className="action-btn admin-btn" title="Admin Panel">
                <FaCog />
              </Link>
            )}
            <Link to="/my-bookings" className="action-btn" title="My Bookings">
              <FaHeart />
            </Link>
            <button className="action-btn" title="Notifications">
              <FaBell />
              <span className="badge">3</span>
            </button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-secondary nav-cta">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary nav-cta">Sign Up</button>
            </SignUpButton>
          </SignedOut>
        </>
      )
    }

    // Fallback: Show basic nav without auth
    return (
      <>
        <Link to="/my-bookings" className="action-btn" title="My Bookings">
          <FaHeart />
        </Link>
        <Link to="/admin" className="action-btn" title="Admin">
          <FaCog />
        </Link>
      </>
    )
  }

  const renderMobileAuth = () => {
    if (isClerkEnabled) {
      return (
        <div className="mobile-auth-buttons">
          <SignedIn>
            {isAdmin && (
              <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                ⚙️ Admin Panel
              </Link>
            )}
            <Link to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
              My Bookings
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-secondary" style={{ width: '100%', marginTop: '16px' }}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>Sign Up</button>
            </SignUpButton>
          </SignedOut>
        </div>
      )
    }

    return (
      <div className="mobile-auth-buttons">
        <Link to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
          My Bookings
        </Link>
        <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
          Admin Panel
        </Link>
      </div>
    )
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">✈</div>
          <span className="brand-text">Travelogue</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {renderAuthSection()}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`navbar-nav mobile ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {renderMobileAuth()}
      </nav>
    </header>
  )
}
