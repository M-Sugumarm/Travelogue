import React from 'react'
import clsx from 'clsx'

export default function Card({trip, onOpen, favored, onToggleFav}){
  return (
    <article className={clsx('trip-card', favored && 'favored')}>
      <div className="media" style={{backgroundImage:`url(${trip.image})`}} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') onOpen() }} aria-label={`Open ${trip.title}`}></div>
      <div className="content">
        <h3>{trip.title}</h3>
        <p className="meta">{trip.location} • {trip.duration} • {trip.budget}</p>
        <p className="summary">{trip.summary}</p>
        <div className="row">
          <div className="tags">{trip.tags.map(t=> <span key={t} className="tag">{t}</span>)}</div>
          <div className="actions">
            <button className="btn" onClick={onOpen}>View</button>
            <button className={clsx('icon-btn','fav')} onClick={onToggleFav} aria-pressed={favored}>{favored? '★' : '☆'}</button>
          </div>
        </div>
      </div>
    </article>
  )
}
