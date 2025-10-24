import React, { useState } from 'react'
import trips from '../data/trips.json'
import TripCard from '../components/TripCard'

export default function Book(){
  const [favorites, setFavorites] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('favorites')||'[]') }catch(e){ return [] }
  })

  function toggleFav(id){
    setFavorites(prev=>{
      const exists = prev.includes(id)
      const next = exists ? prev.filter(x=>x!==id) : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="container book-page">
      <section className="hero-card">
        <div>
          <h1>Book a Trip — Choose & Confirm</h1>
          <p className="muted">Select a trip below and click "Book Now" to open the booking flow. This demo simulates a complete booking experience with date selection, traveler count and a payment mock.</p>
        </div>
        <div>
          <button className="btn glow">View Saved Bookings</button>
        </div>
      </section>

      <section className="book-grid">
        {trips.map(trip => (
          <TripCard 
            key={trip.id}
            trip={trip}
            isFavorite={favorites.includes(trip.id)}
            onToggleFavorite={() => toggleFav(trip.id)}
          />
        ))}
      </section>
    </div>
  )
}
