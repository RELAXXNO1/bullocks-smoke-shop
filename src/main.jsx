import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';
import { app, auth, db, storage } from './config/firebase';
import toast from 'react-hot-toast';

// Ensure Firebase is initialized
try {
  if (!app || !auth || !db || !storage) {
    throw new Error('Firebase services not properly initialized');
  }

  // Test Firebase connection
  auth.onAuthStateChanged(() => {}, (error) => {
    console.error('Firebase auth error:', error);
    toast.error('Error connecting to Firebase services');
  });

  // Global error handler for uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
    toast.error('An unexpected error occurred');
    return false;
  };

  // Global promise rejection handler
  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    toast.error('An unexpected error occurred');
  };

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <Toaster position="top-right" />
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Application initialization error:', error);
  // Show a user-friendly error message
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <h1 style="color: #e11d48;">Application Error</h1>
      <p style="color: #4b5563;">We're having trouble connecting to our services. Please try:</p>
      <ul style="color: #4b5563;">
        <li>Refreshing the page</li>
        <li>Clearing your browser cache</li>
        <li>Checking your internet connection</li>
      </ul>
      <p style="color: #4b5563;">If the problem persists, please contact support.</p>
    </div>
  `;
}