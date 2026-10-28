import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { StudyAbroadProvider } from './context/StudyAbroadContext';
import { getPages } from './api';
import './index.css';

// Start one shared public-content request before route components mount. The
// response primes every page in the in-memory cache for instant SPA navigation.
void getPages().catch(() => {
  // Providers and pages surface a contextual error if the request fails.
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <StudyAbroadProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </StudyAbroadProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
