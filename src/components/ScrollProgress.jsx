/**
 * Progreso global (barra de 1 px, GSAP sobre scaleX) + capítulo activo (Motion: cambio de etiqueta).
 * Motion solo anima el <span> interior; GSAP solo la barra. Nunca el mismo elemento.
 */
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap';
import { CHAPTERS } from '../content/story';
import { useTier } from './TierContext';

const ORDER = ['Car', 'Form', 'Aerodynamics', 'Downforce', 'Detail', 'Control', 'Engineering', 'The machine'];

export function ScrollProgress() {
  const bar = useRef(null);
  const [label, setLabel] = useState('Car');
  const tier = useTier();
  useGSAP(() => {
    gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    CHAPTERS.forEach((c) => {
      ScrollTrigger.create({
        trigger: `#${c.id}`, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => self.isActive && setLabel(c.label),
      });
    });
  }, { dependencies: [] });
  const idx = ORDER.indexOf(label) + 1;
  const reduced = tier === 'static';
  return (
    <>
      <div className="progress" aria-hidden="true"><div ref={bar} className="progress__bar" /></div>
      <header className="topbar">
        <a className="topbar__brand" href="#hero" aria-label="Porsche 911 GT3 RS — back to top">Porsche</a>
        <p className="topbar__chapter" aria-live="polite">
          <span className="topbar__chapter-index" aria-hidden="true">{String(idx).padStart(2, '0')} / 08</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={label}
              className="topbar__chapter-label"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </p>
      </header>
    </>
  );
}
