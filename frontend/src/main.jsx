import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './new-home.css'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx'
import { CategoryProvider } from './context/CategoryContext.jsx'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root');
const app = (
  <StrictMode>
    <HelmetProvider>
      <CategoryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CategoryProvider>
    </HelmetProvider>
  </StrictMode>
);

if (rootElement.hasChildNodes() && rootElement.innerHTML !== '<!--ssr-outlet-->') {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
