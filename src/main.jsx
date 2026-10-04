import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const root = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;
// Si el HTML viene pre-renderizado (build), se hidrata; en desarrollo se monta.
if (root.hasChildNodes()) hydrateRoot(root, app); else createRoot(root).render(app);
