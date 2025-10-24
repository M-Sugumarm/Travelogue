import React, { useEffect, useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle(){
  const [theme, setTheme] = useState(() => {
    try{
      const saved = localStorage.getItem('theme')
      if(saved) return saved
      // default to system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    }catch(e){
      return 'dark'
    }
  })

  useEffect(()=>{
    // apply theme to document body as a class
    document.documentElement.classList.toggle('light-theme', theme === 'light')
    document.documentElement.classList.toggle('dark-theme', theme === 'dark')
    try{ localStorage.setItem('theme', theme) }catch(e){}
  },[theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <button
      className={`theme-toggle ${theme}`}
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="track">
        <span className="icon sun"><FaSun /></span>
        <span className="icon moon"><FaMoon /></span>
        <span className="knob" />
      </span>
    </button>
  )
}
