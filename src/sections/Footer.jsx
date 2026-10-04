import { CREDITS, SOURCES } from '../content/story';

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>About this project</h2>
        <p>{CREDITS.disclaimer}</p>
        <p>{CREDITS.author}</p>
      </div>
      <div>
        <h2>3D model</h2>
        <p><a href={CREDITS.model.href} target="_blank" rel="noopener noreferrer">{CREDITS.model.text}</a> <a href={CREDITS.model.license} target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p>
        <p>{CREDITS.modelNote}</p>
      </div>
      <div>
        <h2>Sources</h2>
        <ul>{SOURCES.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul>
      </div>
    </footer>
  );
}
