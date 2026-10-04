/** Reconstrucción + último plano: coche completo, negro, luz lateral, identidad, claim y EXPLORE. */
import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { FINAL } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { MagneticButton } from '../components/MagneticButton';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

export function FinalScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    const tl = sceneTimeline(ref.current, tier);
    tl.window(q('.final__id')[0], 0.74, 1, 0.06)
      .window(q('.final__claim')[0], 0.8, 1, 0.08)
      .window(q('.final__cta')[0], 0.88, 1, 0.06);
  }, { scope: ref, dependencies: [tier] });
  return (
    <StickyScene ref={ref} id="final" length={3} label="The machine">
      <div className="final__inner hero__inner">
        <p className="hero__id final__id">
          <span className="hero__brand display">{FINAL.brand}</span>
          <span className="hero__model display">{FINAL.model}</span>
        </p>
        <span aria-hidden="true" />
        <h2 className="hero__foot"><span className="hero__claim display final__claim">{FINAL.claim}</span></h2>
        <div className="hero__cta final__cta">
          <MagneticButton href={FINAL.ctaHref} external aria-label="Explore the 911 GT3 RS on porsche.com (opens in a new tab)">{FINAL.cta}</MagneticButton>
        </div>
      </div>
    </StickyScene>
  );
}
