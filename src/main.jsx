import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext'
import App from './App'
import './styles.css'

// Get Clerk publishable key from environment (optional)
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if we have a valid Clerk key (not placeholder)
const hasValidClerkKey = PUBLISHABLE_KEY &&
  PUBLISHABLE_KEY !== 'YOUR_PUBLISHABLE_KEY' &&
  PUBLISHABLE_KEY.startsWith('pk_')

// Wrapper that conditionally uses Clerk
function AuthWrapper({ children }) {
  if (hasValidClerkKey) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        {children}
      </ClerkProvider>
    )
  }
  // If no valid Clerk key, just render children without auth
  console.warn('⚠️ Clerk authentication disabled - add VITE_CLERK_PUBLISHABLE_KEY to .env.local')
  return <>{children}</>
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </AuthWrapper>
  </React.StrictMode>
)
