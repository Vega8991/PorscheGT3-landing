/** DETAIL — "Controlled at every corner." Rueda delantera izquierda real del GLB: gira con el scroll, se separa y deja ver disco y pinza fija. */
import { useRef } from 'react';
import { useGSAP } from '../motion/gsap';
import { WHEELS } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { TextReveal } from '../components/TextReveal';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

const WINDOWS = [[0.1, 0.42], [0.46, 0.74], [0.78, 1]];

export function WheelScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const tl = sceneTimeline(ref.current, tier);
    tl.titleOut(ref.current.querySelector('.caption--top'), 0.3);
    ref.current.querySelectorAll('.chapters > li').forEach((li, i) => tl.window(li, ...WINDOWS[i]));
  }, { scope: ref, dependencies: [tier] });
  return (
    <StickyScene ref={ref} id="wheels" length={3} label="Wheels and brakes">
      <div className="caption caption--title caption--top caption--right">
        <p className="eyebrow"><b>05</b>{WHEELS.eyebrow}</p>
        <TextReveal className="h2">{WHEELS.title}</TextReveal>
      </div>
      <div className="caption">
        <ol className="chapters">
          {WHEELS.notes.map((c) => (
            <li key={c.id}><span className="chapter__label">{c.label}</span><p className="chapter__text">{c.text}</p></li>
          ))}
        </ol>
      </div>
    </StickyScene>
  );
}
