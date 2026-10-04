/**
 * Timeline DOM de una escena sticky, en tiempo local 0–1 (mismo rango de scroll que la timeline maestra:
 * 'top top' → 'bottom bottom'). Solo anima opacidad/transform del texto de la escena.
 */
import { gsap } from '../motion/gsap';

export function sceneTimeline(section, tier) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: tier === 'static' ? true : 0.4 },
  });
  tl.set({}, {}, 1); // duración fija = 1
  const y = tier === 'static' ? 0 : 18;
  // Muestra un elemento entre a y b con fundidos cortos (f).
  tl.window = (el, a, b, f = 0.035) => {
    if (!el) return tl;
    tl.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: f, ease: 'power2.out' }, a);
    if (b < 1) tl.to(el, { opacity: 0, y: -y, duration: f, ease: 'power2.in' }, b);
    return tl;
  };
  // El título deja paso al coche cuando la cámara se acerca.
  tl.titleOut = (el, at, f = 0.04) => {
    if (!el) return tl;
    tl.fromTo(el, { opacity: 1, y: 0 }, { opacity: 0, y: -y, duration: f, ease: 'power2.in', immediateRender: false }, at);
    return tl;
  };
  return tl;
}
