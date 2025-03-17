import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/App.css';
import './styles/styles.css';
import App from './App';

import Register from '../src/pages/Register';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   {/* <Register/> */}
   
      <App />
   
  </StrictMode>
);