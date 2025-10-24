import React, { useState, useEffect } from 'react';
import tripsData from '../data/trips.json';
import TripBookingModal from './TripBookingModal';

export default function BookingLauncher(){
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(tripsData[0]?.id || null);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const t = tripsData.find(t => t.id === selectedId);
    setSelectedTrip(t || null);
  }, [selectedId]);

  return (
    <div className="booking-launcher">
      <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="nav-search">
        {tripsData.map(t => (
          <option key={t.id} value={t.id}>{t.title} — {t.location}</option>
        ))}
      </select>
      <button className="btn ghost" onClick={() => setOpen(true)}>Plan trip</button>

      {open && selectedTrip && (
        <TripBookingModal trip={selectedTrip} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}