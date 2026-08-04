import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Notification prompt handled inside App via NotificationPrompt component
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

serviceWorker.unregister();

//serviceWorker.register();
