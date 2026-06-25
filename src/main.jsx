import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/photos/photos.css'
import './components/decoratives/Decoratives.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
