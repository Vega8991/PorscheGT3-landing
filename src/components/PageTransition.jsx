/**
 * Transición de salto: al navegar a un ancla (EXPLORE, marca), funde a negro, salta sin recorrer
 * toda la coreografía de cámara intermedia y vuelve a abrir. Evita un "avance rápido" de 10 escenas.
 */
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../motion/gsap';
import { MOTION } from '../motion/motion.config';

export const pageTransition = { go: (hash) => { location.hash = hash; } };

export function PageTransition() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    pageTransition.go = (hash, focusSel) => {
      const target = document.querySelector(hash);
      if (!target) return;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const jump = () => {
        const y = target.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: y, behavior: 'instant' });
        ScrollTrigger.update();
        history.replaceState(null, '', hash);
        const f = focusSel ? target.querySelector(focusSel) : target;
        f?.focus?.({ preventScroll: true });
      };
      if (reduced) { jump(); return; }
      gsap.timeline()
        .to(el, { opacity: 1, duration: MOTION.duration.cut, ease: MOTION.ease.inOut })
        .add(jump)
        .to(el, { opacity: 0, duration: MOTION.duration.slow, ease: MOTION.ease.out }, '+=0.15');
    };
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      pageTransition.go(a.getAttribute('href'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return <div ref={ref} className="page-curtain" aria-hidden="true" />;
}
