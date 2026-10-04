/**
 * Sección alta con un contenedor sticky. La altura (en viewports) marca el ritmo de la escena;
 * la timeline maestra lee su posición para colocar los keyframes de cámara.
 */
import { forwardRef } from 'react';
import { TIER_SCALE } from '../motion/motion.config';
import { useTier } from './TierContext';

export const StickyScene = forwardRef(function StickyScene({ id, length = 3, label, className = '', children, ...rest }, ref) {
  const tier = useTier();
  const len = Math.max(1.2, length * (TIER_SCALE[tier]?.pin ?? 1));
  return (
    <section ref={ref} id={id} data-scene={id} className={`scene scene--${id} ${className}`} style={{ '--len': len }} aria-label={label} {...rest}>
      <div className="scene__sticky">{children}</div>
    </section>
  );
});
