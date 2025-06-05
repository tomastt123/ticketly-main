import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './context/AuthProvider'; // Import AuthProvider
import { ThemeProvider } from "./context/ThemeContext";
import "./css/global.css";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Measure performance
reportWebVitals();
