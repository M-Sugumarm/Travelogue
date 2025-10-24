import React, { useEffect, useState } from 'react'

export default function Splash({ onFinish } = {}){
  const [visible, setVisible] = useState(true)
  const [percent, setPercent] = useState(0)

  useEffect(()=>{
    // Lock body scroll while splash is visible
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const start = Date.now()
    const duration = 10000 // 10 seconds

    const iv = setInterval(()=>{
      const elapsed = Date.now() - start
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setPercent(p)
      if(elapsed >= duration){
        clearInterval(iv)
        setVisible(false)
        try{ if(typeof onFinish === 'function') onFinish() }catch(e){}
      }
    }, 100)

    return ()=>{
      clearInterval(iv)
      document.body.style.overflow = prevOverflow
    }
  },[])

  if(!visible) return null

  return (
    <div className="splash" role="dialog" aria-label="Travelogue loading screen">
      <div className="splash-inner">
        <div className="splash-brand">
          <div className="logo-blob" aria-hidden="true" />
          <div className="splash-titles">
            <div className="splash-title">Travelogue</div>
            <div className="splash-sub">Curated mini-itineraries</div>
          </div>
        </div>

        <div className="splash-visuals">
          <div className="splash-ring r1" />
          <div className="splash-ring r2" />
          <div className="splash-plane">✈️</div>
        </div>

        <div className="splash-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${percent}%`}} />
          </div>
          <div className="progress-meta">
            <div className="count">Starting in {Math.ceil((100 - percent) / 10)}s</div>
            <div className="percent">{percent}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
