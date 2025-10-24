import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import trips from '../data/trips.json'
import TripBookingModal from '../components/TripBookingModal'

export default function Trip(){
  const { id } = useParams()
  const trip = trips.find(t => String(t.id) === String(id))
  const [showBooking, setShowBooking] = useState(false)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(()=>{
    if(!leftRef.current || !rightRef.current) return
    // Simple parallel scroll: sync right panel scroll to left content
    const left = leftRef.current
    const right = rightRef.current
    const onScroll = () => {
      const pct = left.scrollTop / (left.scrollHeight - left.clientHeight || 1)
      right.scrollTop = pct * (right.scrollHeight - right.clientHeight || 1)
    }
    left.addEventListener('scroll', onScroll)
    return () => left.removeEventListener('scroll', onScroll)
  },[])

  if(!trip) return (
    <div className="container">
      <h2>Trip not found</h2>
      <Link to="/book">Back to Bookings</Link>
    </div>
  )

  return (
    <div className="container trip-page">
      <div className="trip-hero">
        <div className="hero-media">
          <img src={trip.image} alt={trip.title} />
        </div>
        <div className="hero-info">
          <h1>{trip.title}</h1>
          <p className="muted">{trip.location} • {trip.duration}</p>
          <p className="lead">{trip.summary}</p>
          <div className="tags">
            {trip.tags.map(t=> <span key={t} className="tag">{t}</span>)}
          </div>
          <div style={{marginTop:18}}>
            <button className="btn glow" onClick={()=>setShowBooking(true)}>Start Booking</button>
            <a href="#details" className="btn ghost" style={{marginLeft:10}}>See Details</a>
          </div>
        </div>
      </div>

      <div className="parallel-area">
        <div className="parallel-left" ref={leftRef} id="details">
          <section className="section">
            <h3>Overview</h3>
            <p>{trip.description || trip.summary}</p>
          </section>

          <section className="section">
            <h3>Itinerary</h3>
            {trip.itinerary?.map((it, i)=> (
              <div key={i} className="it-item">
                <h4>{it.day}</h4>
                <p>{it.text}</p>
              </div>
            ))}
          </section>

          <section className="section">
            <h3>What's included</h3>
            <ul>
              {(trip.included||[]).map((inc, i)=> <li key={i}>{inc}</li>)}
            </ul>
          </section>

          <section className="section">
            <h3>Gallery</h3>
            <div className="gallery">
              {(trip.gallery||[]).map((g,i)=>(
                <img key={i} src={g} alt={`${trip.title}-${i}`} />
              ))}
            </div>
          </section>
        </div>

        <aside className="parallel-right" ref={rightRef}>
          <div className="sticky-book">
            <h3>Reserve this trip</h3>
            <div className="price">{trip.budget}</div>
            <p className="muted">Limited spots available — secure your seat</p>
            <div style={{marginTop:12}}>
              <button className="btn book-now" onClick={()=>setShowBooking(true)}>Book Now</button>
              <button className="btn ghost" style={{marginLeft:8}} onClick={()=>window.print()}>Print</button>
            </div>

            <div className="features" style={{marginTop:18}}>
              <div className="feat">Free cancellation</div>
              <div className="feat">Local guide</div>
              <div className="feat">Small groups</div>
            </div>
          </div>
        </aside>
      </div>

      {showBooking && <TripBookingModal trip={trip} onClose={()=>setShowBooking(false)} />}
    </div>
  )
}
