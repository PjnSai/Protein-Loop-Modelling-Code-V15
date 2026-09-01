/* main.jsx - React Application Entry Point */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'                              
import App from './App.jsx'                       
import { AuthProvider } from './context/AuthContext';  


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Authentication Context Provider - Provides global authentication state management throughout the application.
    Handles user session, login status, and authentication state persistence across component re-renders and navigation events.
    */}
    <AuthProvider>
      {/* Main Application Component - Contains the complete application including routing, navigation, page components, and footer.
      Wrapped in authentication context to enable secure route protection and user state management. */}
      <App />
    </AuthProvider>
  </StrictMode>,
)