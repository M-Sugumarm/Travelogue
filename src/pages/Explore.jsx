import React from 'react'
import trips from '../data/trips.json'
import Card from '../components/Card'

export default function Explore(){
  return (
    <div className="container explore">
      <h2>Explore Destinations</h2>
      <p className="muted">Browse all mini-itineraries and save your favourites.</p>
      <section className="grid">
        {trips.map(t=> <Card key={t.id} trip={t} onOpen={()=>{}} favored={false} onToggleFav={()=>{}} />)}
      </section>
    </div>
  )
}
