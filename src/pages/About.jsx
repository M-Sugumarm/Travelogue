import React from 'react'

export default function About(){
  return (
    <div className="container about">
      <h2>About Travelogue</h2>
      <p>This demo app is built for the ProU Frontend assessment. It demonstrates a small interactive UI built with React, responsive layouts, accessible modals, client-side state, and mock JSON data.</p>
      <ul>
        <li>Tech: React + Vite</li>
        <li>Features: Search, favorites, modal details, responsive grid</li>
        <li>Notes: No backend; data served from local JSON.</li>
      </ul>
    </div>
  )
}
