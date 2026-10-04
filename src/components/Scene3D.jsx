/**
 * Escenario: póster estático primero; el chunk de three + GLB se cargan en diferido tras el primer pintado.
 * Sin WebGL o en dispositivos débiles se queda el póster (y el contenido completo en HTML).
 */
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { TIER_SCALE } from '../motion/motion.config';
import { HERO } from '../content/story';
import { markModelReady } from '../three/loadState';

const Experience = lazy(() => import('../three/Experience'));

export function Scene3D({ tier, posterVisible }) {
  const webgl = TIER_SCALE[tier]?.webgl;
  const [mount, setMount] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!webgl) { markModelReady(); return; }
    const go = () => setMount(true);
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 600 }) : setTimeout(go, 200);
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id));
  }, [webgl]);

  const onReady = useCallback(() => markModelReady(), []);
  const onFirstFrame = useCallback(() => setLive(true), []);

  return (
    <div className={`stage ${live ? 'is-live' : ''}`} aria-hidden="true">
      <img
        className={`stage__poster ${posterVisible || !webgl ? 'is-visible' : ''}`}
        src="/poster/hero-1600.webp"
        srcSet="/poster/hero-800.webp 800w, /poster/hero-1600.webp 1600w"
        sizes="100vw" width="1600" height="900" alt="" fetchPriority="high" decoding="async"
      />
      {mount && (
        <Suspense fallback={null}>
          <Experience tier={tier} onReady={onReady} onFirstFrame={onFirstFrame} />
        </Suspense>
      )}
    </div>
  );
}
export const POSTER_ALT = HERO.posterAlt;
