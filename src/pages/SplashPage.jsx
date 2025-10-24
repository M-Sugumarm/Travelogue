import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Splash from '../components/Splash'

export default function SplashPage(){
  const navigate = useNavigate()

  useEffect(()=>{
    // ensure splash is shown only once per session by default
    // If you always want to show splash, remove this
    const seen = sessionStorage.getItem('seenSplash')
    if(seen){
      navigate('/')
    }
  },[navigate])

  return (
    <Splash onFinish={() => {
      try{ sessionStorage.setItem('seenSplash','1') }catch(e){}
      navigate('/')
    }} />
  )
}
