import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import { App } from './App';
import { LogProvider } from './providers';
import './index.css';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>
      <LogProvider>
        <App />
      </LogProvider>
    </Router>
  </React.StrictMode>
);