/** DETAIL — sucesión de macros con barrido de luz. La cámara se retira y vuelve a acercarse: nunca hay corte. */
import { useRef } from 'react';
import { useGSAP } from '../motion/gsap';
import { MACRO } from '../content/story';
import { StickyScene } from '../components/StickyScene';
import { sceneTimeline } from '../components/sceneTimeline';
import { useTier } from '../components/TierContext';

const FULL = [[0, 0.17], [0.31, 0.46], [0.6, 0.75], [0.92, 1]];
const LITE = [[0, 0.3], [0.5, 0.7], [0.92, 1], null];

export function MacroScene() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    const tl = sceneTimeline(ref.current, tier);
    tl.titleOut(ref.current.querySelector('.caption--top'), 0.08);
    const W = tier === 'full' ? FULL : LITE;
    const items = ref.current.querySelectorAll('.chapters > li');
    // En móvil hay 3 planos: el respiradero se integra en el paso al carbono.
    const map = tier === 'full' ? [0, 1, 2, 3] : [0, null, 1, 2];
    items.forEach((li, i) => { const w = map[i] == null ? null : W[map[i]]; if (w) tl.window(li, ...w, 0.03); });
  }, { scope: ref, dependencies: [tier] });
  return (
    <StickyScene ref={ref} id="macro" length={4.2} label="Details">
      <div className="caption caption--title caption--top">
        <p className="eyebrow"><b>05</b>{MACRO.eyebrow}</p>
        <h2 className="h2">{MACRO.title}</h2>
      </div>
      <div className="caption">
        <ol className="chapters">
          {MACRO.shots.map((c, i) => (
            <li key={c.id}><span className="chapter__label">{String(i + 1).padStart(2, '0')} {c.label}</span><p className="chapter__text">{c.text}</p></li>
          ))}
        </ol>
      </div>
    </StickyScene>
  );
}
