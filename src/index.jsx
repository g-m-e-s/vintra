import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/globalStyles.css';

// Log environment information for debugging
const env = import.meta.env;
console.log('Environment:', {
  mode: env.MODE,
  prod: env.PROD,
  dev: env.DEV,
  apiUrl: env.VITE_API_URL,
  pythonApiUrl: env.VITE_PYTHON_API_URL
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
