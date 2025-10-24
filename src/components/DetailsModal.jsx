import React from 'react'

export default function DetailsModal({trip, onClose}){
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true">
        <header>
          <h3>{trip.title}</h3>
          <button className="icon-btn close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <img src={trip.image} alt={trip.title} />
          <div className="info">
            <p className="meta">{trip.location} • {trip.duration} • {trip.budget}</p>
            <p>{trip.summary}</p>
            <h4>Itinerary</h4>
            <ul>{trip.itinerary.map((s,i)=> <li key={i}>{s}</li>)}</ul>
            <h4>Highlights</h4>
            <div className="highlights">{trip.highlights.map(h=> <span key={h} className="pill">{h}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
