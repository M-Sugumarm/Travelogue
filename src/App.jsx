import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Explore from './pages/Explore'
import Book from './pages/Book'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import Trip from './pages/Trip'
import SplashPage from './pages/SplashPage'
import MyBookings from './pages/MyBookings'
import AdminPanel from './pages/AdminPanel'
import ToastContainer from './components/ToastContainer'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // On first app load, if the user hasn't seen the splash this session,
    // navigate to /splash before showing home. If user already on another
    // route or /splash, don't redirect.
    const seen = sessionStorage.getItem('seenSplash')
    if (!seen && location.pathname !== '/splash') {
      navigate('/splash', { replace: true })
    }
  }, [location.pathname, navigate])

  const hideShell = location.pathname === '/splash'

  return (
    <div className="app-root">
      {!hideShell && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/book" element={<Book />} />
          <Route path="/trip/:tripId" element={<Trip />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
      <ToastContainer />
    </div>
  )
}
