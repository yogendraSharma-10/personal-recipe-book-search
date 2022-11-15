import React from 'react';
import ReactDOM from 'react-dom/client'; // Using React 18's createRoot API for better performance and concurrent features
import App from './App';
import './styles/App.css'; // Import the main application stylesheet

/**
 * This is the entry point of the React client-side application.
 * It mounts the main App component into the DOM.
 */

// Find the root DOM element where the React application will be mounted.
// This element is typically defined in public/index.html.
const rootElement = document.getElementById('root');

// Check if the root element exists to prevent errors during rendering.
if (!rootElement) {
  console.error('Root element with ID "root" not found in the document.');
  // Optionally, throw an error or handle this case more robustly in a real application.
} else {
  // Create a React root using ReactDOM.createRoot.
  // This is the recommended way to render a React application starting with React 18.
  const root = ReactDOM.createRoot(rootElement);

  // Render the main App component into the root.
  // React.StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants during development.
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}