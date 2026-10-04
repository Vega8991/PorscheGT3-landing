/** FORM — "Every line has a reason." Seis capítulos de cámara; una anotación solo cuando el texto habla de esa pieza. */
import { useRef } from 'react';
import { useGSAP } from '../motion/gsap';
import { FORM } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { TextReveal } from '../components/TextReveal';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

// Ventanas (t local) alineadas con choreography.form
const WINDOWS = [[0.02, 0.14], [0.19, 0.3], [0.35, 0.47], [0.52, 0.63], [0.68, 0.8], [0.88, 1]];

export function FormScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const tl = sceneTimeline(ref.current, tier);
    tl.titleOut(ref.current.querySelector('.caption--top'), 0.13);
    ref.current.querySelectorAll('.chapters > li').forEach((li, i) => tl.window(li, ...WINDOWS[i]));
  }, { scope: ref, dependencies: [tier] });

  return (
    <StickyScene ref={ref} id="form" length={4.5} label="Form">
      <div className="caption caption--title caption--top">
        <p className="eyebrow"><b>02</b>{FORM.eyebrow}</p>
        <TextReveal className="h2">{FORM.title}</TextReveal>
      </div>
      <div className="caption">
        <ol className="chapters">
          {FORM.chapters.map((c) => (
            <li key={c.id}>
              <span className="chapter__label">{c.label}</span>
              <p className="chapter__text">{c.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </StickyScene>
  );
}
