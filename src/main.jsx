// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext.jsx';

// FORCE LIGHT MODE
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </AuthProvider>
  </StrictMode>
);