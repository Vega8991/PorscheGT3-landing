/** DOWNFORCE — "Air becomes grip." Macro del alerón real: sube, el elemento superior se aplana (DRS), cuellos de cisne. */
import { useRef } from 'react';
import { useGSAP } from '../motion/gsap';
import { WING } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { TextReveal } from '../components/TextReveal';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

const WINDOWS = [[0.5, 0.7], [0.72, 1]];

export function WingScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const tl = sceneTimeline(ref.current, tier);
    tl.titleOut(ref.current.querySelector('.caption--top'), 0.26);
    ref.current.querySelectorAll('.chapters > li').forEach((li, i) => tl.window(li, ...WINDOWS[i]));
  }, { scope: ref, dependencies: [tier] });
  return (
    <StickyScene ref={ref} id="wing" length={2.8} label="Downforce">
      <div className="caption caption--title caption--top">
        <p className="eyebrow"><b>04</b>{WING.eyebrow}</p>
        <TextReveal className="h2">{WING.title}</TextReveal>
      </div>
      <div className="caption">
        <ol className="chapters">
          {WING.notes.map((c) => (
            <li key={c.id}><span className="chapter__label">{c.label}</span><p className="chapter__text">{c.text}</p></li>
          ))}
        </ol>
      </div>
    </StickyScene>
  );
}
