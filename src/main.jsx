import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    throw new Error('Root element not found');
  }
  console.log('main.jsx: Starting render');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('main.jsx: Render successful');
} catch (error) {
  console.error('main.jsx: Render failed:', error);
  document.body.innerHTML = `
    <div style="color: red; text-align: center; padding: 20px;">
      <h1>Error Rendering Application</h1>
      <p>${error.message}</p>
      <p>Check the console for details.</p>
    </div>
  `;
}
