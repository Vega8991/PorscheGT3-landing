/**
 * CTA con atracción magnética muy sutil (solo puntero fino) y muelle amortiguado.
 * Motion controla el transform del <span> interior; el contenedor puede recibir GSAP sin conflicto.
 */
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { MOTION } from '../motion/motion.config';
import { useTier } from './TierContext';

export function MagneticButton({ href, onClick, children, className = '', external, ...rest }) {
  const tier = useTier();
  const ref = useRef(null);
  const rect = useRef(null);
  const x = useSpring(useMotionValue(0), MOTION.spring.ui);
  const y = useSpring(useMotionValue(0), MOTION.spring.ui);
  const enabled = tier === 'full';

  const onEnter = () => { rect.current = ref.current.getBoundingClientRect(); };
  const onMove = (e) => {
    if (!enabled || !rect.current) return;
    const r = rect.current;
    x.set((e.clientX - r.left - r.width / 2) * MOTION.magnetic.strength);
    y.set((e.clientY - r.top - r.height / 2) * MOTION.magnetic.strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const Tag = href ? 'a' : 'button';
  return (
    <div className={`magnetic ${className}`} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave} style={{ display: 'inline-block' }}>
      <motion.span style={{ x, y, display: 'inline-block' }}>
        <Tag
          ref={ref}
          className="cta"
          href={href}
          onClick={onClick}
          data-cursor="hover"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...(Tag === 'button' ? { type: 'button' } : {})}
          {...rest}
        >
          {children}
          <span className="cta__arrow" aria-hidden="true" />
        </Tag>
      </motion.span>
    </div>
  );
}
