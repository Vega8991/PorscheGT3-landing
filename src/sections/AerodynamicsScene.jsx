/**
 * AERODYNAMICS — "Sculpted by air." → "Downforce changes everything."
 * El aire se dibuja de morro a cola; después aparecen las flechas de carga y las dos cifras oficiales.
 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { AERO } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

export function AerodynamicsScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    const tl = sceneTimeline(ref.current, tier);
    tl.window(q('.aero__t1')[0], 0.02, 0.48)
      .window(q('.aero__t2')[0], 0.54, 1)
      .window(q('.aero__note')[0], 0.06, 0.48)
      .window(q('.figure')[0], 0.68, 1)
      .window(q('.figure')[1], 0.88, 1);
  }, { scope: ref, dependencies: [tier] });

  return (
    <StickyScene ref={ref} id="aero" length={3.5} label="Aerodynamics">
      <div className="caption caption--title caption--top">
        <p className="eyebrow"><b>03</b>{AERO.eyebrow}</p>
        <div className="aero__titles">
          <h2 className="h2 aero__t1">{AERO.title}</h2>
          <p className="h2 aero__t2">{AERO.subtitle}</p>
        </div>
      </div>
      <div className="caption">
        <p className="note aero__note">{AERO.flowNote}</p>
        <dl className="figures">
          {AERO.figures.map((f) => (
            <div className="figure" key={f.value}>
              <dt className="sr-only">{f.context}</dt>
              <dd style={{ margin: 0 }}>
                <span className="figure__value">{f.value}<span className="figure__unit">{f.unit}</span></span>
                <span className="figure__context">{f.context}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </StickyScene>
  );
}
