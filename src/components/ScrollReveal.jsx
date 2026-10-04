/** Entrada al entrar en viewport (opacidad + desplazamiento corto). Solo transform/opacity. */
import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { MOTION } from '../motion/motion.config';
import { useTier } from './TierContext';

export function ScrollReveal({ as: Tag = 'div', y = MOTION.reveal.y, stagger = 0, start = MOTION.reveal.start, className = '', children, ...rest }) {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const targets = stagger ? ref.current.children : ref.current;
    gsap.from(targets, {
      opacity: 0, y: tier === 'static' ? 0 : y, duration: MOTION.duration.slow, ease: MOTION.ease.out, stagger,
      scrollTrigger: { trigger: ref.current, start, toggleActions: 'play none none reverse' },
    });
  }, { scope: ref, dependencies: [tier] });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
