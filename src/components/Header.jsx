import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import BookingLauncher from './BookingLauncher'
import logo from '../assets/logo.svg'
import ThemeToggle from './ThemeToggle'

export default function Header(){
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header enhanced">
      <div className="header-inner">
        <div className="brand">
          <Link to="/" className="logo">
            <img src={logo} alt="Travelogue" className="site-logo" />
            <span className="logo-text">Travelogue</span>
          </Link>
          <span className="tag">Curated mini-itineraries</span>
        </div>

        <div className="search-cta">
          {/* Booking launcher provides a destination selector and opens booking modal */}
          <BookingLauncher />
        </div>

        <nav className={"nav" + (open? ' open':'')} aria-expanded={open}>
          <Link to="/" className={loc.pathname==='/'? 'active' : ''}>Home</Link>
          <Link to="/explore" className={loc.pathname==='/explore'? 'active':''}>Explore</Link>
          <Link to="/book" className={loc.pathname==='/book'? 'active':''}>Book</Link>
          <Link to="/contact" className={loc.pathname==='/contact'? 'active':''}>Contact</Link>
          <Link to="/about" className={loc.pathname==='/about'? 'active':''}>About</Link>
        </nav>

        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <ThemeToggle />
          <button className="hamburger" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
