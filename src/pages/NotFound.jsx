import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="container notfound">
      <h2>404 — Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  )
}
