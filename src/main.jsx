import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found. Ensure index.html has <div id="root"></div>');
    throw new Error('Root element not found');
  }
  console.log('main.jsx: Starting render of App component');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('main.jsx: App component rendered successfully');
} catch (error) {
  console.error('main.jsx: Failed to render React app:', error);
  document.body.innerHTML = `
    <div style="color: red; text-align: center; padding: 20px;">
      <h1>Error Rendering Application</h1>
      <p>${error.message}</p>
      <p>Check the browser console for details and contact support.</p>
    </div>
  `;
}
