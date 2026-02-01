import React from 'react'

export default function DetailsModal({ trip, onClose, onBook }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <header>
          <h3>{trip.title}</h3>
          <button className="btn-primary small" onClick={() => { onClose(); onBook?.() }}>Book Now</button>
          <button className="icon-btn close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <img src={trip.image} alt={trip.title} />
          <div className="info">
            <p className="meta">{trip.location} • {trip.duration} • {trip.budget?.replace('$', '₹')}</p>
            <p>{trip.summary}</p>
            <div className="description-section">
              {trip.description && <p>{trip.description}</p>}
            </div>
            <h4>Itinerary</h4>
            <ul>
              {trip.itinerary?.map((item, i) => (
                <li key={i}>
                  {typeof item === 'string' ? item : (
                    <><strong>Day {item.day || i + 1}: {item.title}</strong> {item.description && `- ${item.description}`}</>
                  )}
                </li>
              ))}
            </ul>
            <h4>Highlights</h4>
            <div className="highlights">{trip.highlights?.map(h => <span key={h} className="pill">{h}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
