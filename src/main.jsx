import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AutoSearchFilter } from './context/AutoSearch.jsx'
import './index.css'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundry.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { UserProvider } from './context/UserProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <CartProvider>
            <App />
          </CartProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </UserProvider>
  </StrictMode>,
)
