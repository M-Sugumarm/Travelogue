import React, { useState } from 'react'
import trips from '../data/trips.json'
import Card from '../components/Card'
import DetailsModal from '../components/DetailsModal'
import Background from '../components/Background'

export default function Home(){
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('favorites')||'[]') }catch(e){ return [] }
  })

  const filtered = trips.filter(t=> t.title.toLowerCase().includes(query.toLowerCase()) || t.tags.join(' ').includes(query.toLowerCase()))
  
  // More robust real-time search: match query tokens across multiple fields
  const matchesQuery = (trip, q) => {
    const qtrim = q.trim().toLowerCase()
    if(!qtrim) return true
    const tokens = qtrim.split(/\s+/).filter(Boolean)

    const hay = [
      trip.title || '',
      trip.location || '',
      trip.summary || '',
      trip.description || '',
      (trip.tags || []).join(' '),
      (trip.included || []).join(' '),
      (trip.itinerary || []).map(i=> i.text).join(' ')
    ].join(' ').toLowerCase()

    // require that every token appears somewhere in the combined text
    return tokens.every(tok => hay.indexOf(tok) !== -1)
  }

  const robustFiltered = trips.filter(t => matchesQuery(t, query))

  function toggleFav(id){
    setFavorites(prev=>{
      const exists = prev.includes(id)
      const next = exists ? prev.filter(x=>x!==id) : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="container home">

      <section className="hero animated-hero">
        <div className="left">
          <h1>Travelogue — Mini itineraries that spark ideas</h1>
          <p className="lead">Short, practical trip plans you can try this weekend. Interactive previews, budgets and highlights to help you choose fast.</p>
          <div className="cta-row">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search destinations, tags or vibes" />
            <button className="btn" onClick={()=>{ /* demo */ }}>Explore</button>
          </div>
          <div className="features">
            <div className="feat">✨ Instant previews</div>
            <div className="feat">🔖 Save favourites</div>
            <div className="feat">🚀 Mobile-ready</div>
          </div>
        </div>
        <div className="right">
          <div className="showcase">
              {robustFiltered.slice(0,3).map(t=> (
                <div key={t.id} className="show-item" style={{backgroundImage:`url(${t.image})`}} onClick={()=>setSelected(t)} title={t.title} />
              ))}
          </div>
        </div>
      </section>

      <Background />
        <section className="grid results">
          {robustFiltered.length === 0 && (
            <div style={{padding:24, color:'var(--muted)'}}>No trips matched "{query}" — try another word like "Japan", "China", or a vibe (beach, city).</div>
          )}
          {robustFiltered.length > 0 && Array.from({length:Math.max(robustFiltered.length, 12)}).map((_,i)=>{
            const trip = robustFiltered[i % robustFiltered.length]
            return <Card key={`${trip.id}-${i}`} trip={trip} onOpen={()=>setSelected(trip)} favored={favorites.includes(trip.id)} onToggleFav={()=>toggleFav(trip.id)} />
          })}
        </section>

      {selected && <DetailsModal trip={selected} onClose={()=>setSelected(null)} />}
    </div>
  )
}
