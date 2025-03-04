import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/App.css';
import './styles/styles.css';
import App from './App';
import { UserProvider } from './UserContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    
      <App />
    </UserProvider>
  </StrictMode>
);