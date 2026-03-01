import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './new-home.css'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx'
import { CategoryProvider } from './context/CategoryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <CategoryProvider>
        <App />
      </CategoryProvider>
    </HelmetProvider>
  </StrictMode>,
)
