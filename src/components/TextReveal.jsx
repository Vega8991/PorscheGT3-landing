/**
 * Revelado de titulares por líneas con máscara (SplitText). El texto sigue siendo un encabezado real
 * (SplitText conserva aria-label). Con movimiento reducido: fundido simple.
 */
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../motion/gsap';
import { MOTION } from '../motion/motion.config';
import { useTier } from './TierContext';

export function TextReveal({ as: Tag = 'h2', className = '', children, trigger = 'enter', start = MOTION.reveal.start, delay = 0, ...rest }) {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    if (trigger === 'manual') return;
    const el = ref.current;
    if (tier === 'static') {
      gsap.from(el, { opacity: 0, duration: MOTION.duration.base, scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' } });
      return;
    }
    let split;
    document.fonts.ready.then(() => {
      split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'tr-line' });
      gsap.from(split.lines, {
        yPercent: 105, duration: MOTION.duration.slow, ease: MOTION.ease.expo, stagger: MOTION.stagger.base, delay,
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
      });
    });
    return () => split?.revert();
  }, { scope: ref, dependencies: [tier] });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
