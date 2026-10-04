/** Silencio deliberado: coche despiezado casi inmóvil, luz mínima, dos frases. Ritmo lento a propósito. */
import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { CONTROL } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

export function ControlScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    const tl = sceneTimeline(ref.current, tier);
    tl.window(q('.quiet__line')[0], 0.08, 0.5, 0.08).window(q('.quiet__line')[1], 0.6, 1, 0.08);
  }, { scope: ref, dependencies: [tier] });
  return (
    <StickyScene ref={ref} id="control" length={2.2} label="Control">
      <div className="quiet">
        <div className="quiet__stack">
          {CONTROL.lines.map((l, i) => i === 0
            ? <h2 key={l} className="quiet__line">{l}</h2>
            : <p key={l} className="quiet__line">{l}</p>)}
        </div>
      </div>
    </StickyScene>
  );
}
