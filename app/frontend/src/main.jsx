import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Minimal React entry — mounts App into #root
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
