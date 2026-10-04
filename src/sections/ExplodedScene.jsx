/**
 * ENGINEERING — exploded view en 7 capas con cámara estable, seguida de la vista técnica en rayos X.
 * Aviso explícito: la mecánica del modelo es ilustrativa.
 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { EXPLODED } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { TextReveal } from '../components/TextReveal';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

// Momento en que cada capa empieza a separarse (choreography.exploded)
const LAYER_AT = [0.06, 0.16, 0.3, 0.4, 0.5, 0.6, 0.7];

export function ExplodedScene() {
  const ref = useRef(null);
  const tech = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const tl = sceneTimeline(ref.current, tier);
    ref.current.querySelectorAll('.layers > li').forEach((li, i) => {
      tl.fromTo(li, { opacity: 0.25 }, { opacity: 1, duration: 0.04 }, LAYER_AT[i]);
    });
    const t2 = sceneTimeline(tech.current, tier);
    const q = gsap.utils.selector(tech);
    t2.window(q('.tech__body')[0], 0.3, 1).window(q('.disclaimer')[0], 0.4, 1);
  }, { scope: ref, dependencies: [tier] });

  return (
    <>
      <StickyScene ref={ref} id="exploded" length={3.6} label="Exploded view">
        <div className="caption caption--title caption--top">
          <p className="eyebrow"><b>07</b>{EXPLODED.eyebrow}</p>
          <TextReveal className="h2">{EXPLODED.title}</TextReveal>
        </div>
        <div className="caption">
          <ol className="layers" aria-label="Layers">
            {EXPLODED.groups.map((g) => <li key={g.id}><b>{g.n}</b>{g.label}</li>)}
          </ol>
        </div>
      </StickyScene>
      <StickyScene ref={tech} id="technical" length={2.6} label="Technical view">
        <div className="caption caption--title caption--top">
          <p className="eyebrow"><b>07</b>{EXPLODED.eyebrow}</p>
          <TextReveal className="h2">{EXPLODED.technical.title}</TextReveal>
        </div>
        <div className="caption">
          <p className="body tech__body">{EXPLODED.technical.text}</p>
          <p className="disclaimer">{EXPLODED.technical.disclaimer}</p>
        </div>
      </StickyScene>
    </>
  );
}
