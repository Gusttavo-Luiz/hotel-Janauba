import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import './styles/index.css';
import App from './App';
import { basePath } from './lib/utils';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={basePath || undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Páginas pré-renderizadas no build são hidratadas. Se o servidor devolver o HTML de
// outra rota (ex.: fallback de SPA) ou em desenvolvimento, renderiza do zero.
const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
const route = normalize(window.location.pathname.slice(basePath.length) || '/');
if (container.hasChildNodes() && container.dataset.route === route) {
  hydrateRoot(container, app);
} else {
  container.innerHTML = '';
  createRoot(container).render(app);
}
