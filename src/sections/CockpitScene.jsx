/** CONTROL — "Built around the driver." Escena silenciosa: la cámara entra por la ventanilla del conductor. */
import { useRef } from 'react';
import { useGSAP } from '../motion/gsap';
import { COCKPIT } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { TextReveal } from '../components/TextReveal';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

const WINDOWS = [[0.48, 0.64], [0.7, 0.86], [0.9, 1]];

export function CockpitScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const tl = sceneTimeline(ref.current, tier);
    tl.titleOut(ref.current.querySelector('.caption--top'), 0.24);
    ref.current.querySelectorAll('.chapters > li').forEach((li, i) => tl.window(li, ...WINDOWS[i], 0.04));
  }, { scope: ref, dependencies: [tier] });
  return (
    <StickyScene ref={ref} id="cockpit" length={3.5} label="Cockpit">
      <div className="caption caption--title caption--top">
        <p className="eyebrow"><b>06</b>{COCKPIT.eyebrow}</p>
        <TextReveal className="h2">{COCKPIT.title}</TextReveal>
      </div>
      <div className="caption">
        <ol className="chapters">
          {COCKPIT.notes.map((c) => (
            <li key={c.id}><span className="chapter__label">{c.label}</span><p className="chapter__text">{c.text}</p></li>
          ))}
        </ol>
      </div>
    </StickyScene>
  );
}
