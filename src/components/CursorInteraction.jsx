/** Cursor secundario discreto (anillo con retardo). Solo escritorio con puntero fino; el cursor del sistema se mantiene. */
import { useEffect, useRef } from 'react';
import { gsap } from '../motion/gsap';
import { MOTION } from '../motion/motion.config';
import { useTier } from './TierContext';

export function CursorInteraction() {
  const tier = useTier();
  const ref = useRef(null);
  useEffect(() => {
    if (tier !== 'full' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, 'x', { duration: MOTION.cursor.lag, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: MOTION.cursor.lag, ease: 'power3' });
    const move = (e) => { xTo(e.clientX); yTo(e.clientY); el.classList.add('is-on'); };
    const over = (e) => el.classList.toggle('is-hover', !!e.target.closest?.('a, button, [data-cursor="hover"]'));
    const leave = () => el.classList.remove('is-on');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [tier]);
  if (tier !== 'full') return null;
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
