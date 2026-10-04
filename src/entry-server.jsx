// Pre-render en build: el HTML completo (todos los textos) existe sin JavaScript y para SEO.
import { renderToString } from 'react-dom/server';
import App from './App';
export function render() {
  return renderToString(<App initialTier="full" />);
}
