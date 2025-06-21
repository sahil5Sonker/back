// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppState from './context/AppState'; // ✅ Import AppState
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppState> {/* ✅ Wrap App inside AppState */}
      <App />
    </AppState>
  </React.StrictMode>
);

reportWebVitals();
