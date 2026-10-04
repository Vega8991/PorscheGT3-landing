/**
 * CAR — entrada cinematográfica (por tiempo, una sola vez) + salida ligada al scroll.
 * 0 % negro · 15 % línea de luz · 30 % silueta · 50 % carrocería · 70 % detalles · 85 % identidad · 100 % claim.
 * El texto existe en HTML desde el principio; solo su aparición está coreografiada.
 */
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../motion/gsap';
import { MOTION } from '../motion/motion.config';
import { HERO } from '../content/story';
import { intro } from '../scroll/director';
import { modelReady } from '../three/loadState';
import { StickyScene } from '../components/StickyScene';
import { MagneticButton } from '../components/MagneticButton';
import { useTier } from '../components/TierContext';

const MODEL_TIMEOUT = 6; // s: si el 3D no llega, la intro continúa con el póster

export function HeroScene({ onPosterNeeded }) {
  const ref = useRef(null);
  const tier = useTier();

  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    const T = MOTION.intro.total;
    const at = (pct) => (pct / 100) * T;
    const idEls = q('.hero__id > *');
    const claim = q('.hero__claim');
    const cta = q('.hero__cta');
    // La intro toma el control: desde aquí GSAP gestiona la opacidad (el CSS de seguridad deja de aplicar).
    gsap.set([...idEls, claim, cta], { opacity: 0 });
    document.documentElement.classList.add('intro-live');

    const skip = new URLSearchParams(location.search).has('skipintro');
    if (skip || tier === 'static' || tier === 'static-lite') {
      Object.assign(intro, { strip: 1, stripW: 1, rim: 1, env: 1, key: 1, head: 1, done: true });
      gsap.to([...idEls, claim, cta], { opacity: 1, duration: MOTION.duration.base, stagger: MOTION.stagger.tight });
      if (tier === 'static-lite') onPosterNeeded?.(true);
      return;
    }

    let split;
    const tl = gsap.timeline({ paused: true, onComplete: () => { intro.done = true; } });
    gsap.set([idEls, cta], { opacity: 0 });
    gsap.set(claim, { opacity: 0 });

    tl.to(intro, { stripW: 1, strip: 1, duration: 0.9, ease: MOTION.ease.expo }, at(15))
      .addLabel('needModel', at(30))
      .to(intro, { rim: 1, duration: 1.1, ease: MOTION.ease.inOut }, at(30))
      .to(intro, { env: 1, duration: 1.3, ease: MOTION.ease.inOut }, at(50))
      .to(intro, { key: 1, head: 1, duration: 0.9, ease: MOTION.ease.out }, at(70))
      .to(idEls, { opacity: 1, y: 0, duration: MOTION.duration.slow, ease: MOTION.ease.out, stagger: MOTION.stagger.base }, at(85))
      .add(() => {
        gsap.set(claim, { opacity: 1 });
        split = SplitText.create(claim, { type: 'lines,words', mask: 'lines' });
        gsap.from(split.words, { yPercent: 110, duration: MOTION.duration.cinematic, ease: MOTION.ease.expo, stagger: MOTION.stagger.base });
      }, at(100) - 0.35)
      .to(cta, { opacity: 1, duration: MOTION.duration.slow, ease: MOTION.ease.out }, at(100) + 0.3);
    gsap.set(idEls, { y: 12 });

    // La intro arranca ya; si el modelo no está listo al 30 %, espera (máx. MODEL_TIMEOUT s).
    let waiting = false;
    tl.eventCallback('onUpdate', () => {
      if (!waiting && tl.time() >= at(30) && !ready) { waiting = true; tl.pause(); }
    });
    let ready = false;
    const timeout = gsap.delayedCall(MODEL_TIMEOUT, () => { if (!ready) { onPosterNeeded?.(true); ready = true; tl.play(); } });
    modelReady.then(() => { ready = true; timeout.kill(); if (waiting) tl.play(); });
    document.fonts.ready.then(() => tl.play());

    // Si el usuario empieza a desplazarse durante la intro, se completa rápido en lugar de bloquearle.
    const onScroll = () => { if (scrollY > 24 && !intro.done) tl.timeScale(4); };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Salida del hero ligada al scroll: el claim sube y se desvanece mientras la cámara gira al frontal.
    gsap.to(q('.hero__inner'), {
      opacity: 0, y: -40, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    });

    return () => { window.removeEventListener('scroll', onScroll); split?.revert(); timeout.kill(); };
  }, { scope: ref, dependencies: [tier] });

  return (
    <StickyScene ref={ref} id="hero" length={1.6} label="Introduction">
      <div className="hero__inner">
        <h1 className="hero__h1">
          <span className="hero__id">
            <span className="hero__brand display">{HERO.brand}</span>
            <span className="hero__model display">{HERO.model}</span>
          </span>
          <span aria-hidden="true" />
          <span className="hero__foot">
            <span className="hero__claim display">{HERO.claim}</span>
          </span>
        </h1>
        <div className="hero__cta">
          <MagneticButton href="#form">{HERO.cta}</MagneticButton>
        </div>
      </div>
    </StickyScene>
  );
}
