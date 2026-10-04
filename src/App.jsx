import { useEffect, useState } from 'react';
import { TierContext } from './components/TierContext';
import { getMotionTier, onTierChange } from './motion/tier';
import { ScrollTrigger } from './motion/gsap';
import { buildMaster } from './scroll/masterTimeline';
import { Scene3D } from './components/Scene3D';
import { AnnotationLayer } from './components/AnnotationLayer';
import { ScrollProgress } from './components/ScrollProgress';
import { CursorInteraction } from './components/CursorInteraction';
import { PageTransition } from './components/PageTransition';
import { HeroScene } from './sections/HeroScene';
import { FormScene } from './sections/FormScene';
import { AerodynamicsScene } from './sections/AerodynamicsScene';
import { WingScene } from './sections/WingScene';
import { WheelScene } from './sections/WheelScene';
import { MacroScene } from './sections/MacroScene';
import { CockpitScene } from './sections/CockpitScene';
import { ExplodedScene } from './sections/ExplodedScene';
import { PerformanceNumbers } from './sections/PerformanceNumbers';
import { ControlScene } from './sections/ControlScene';
import { FinalScene } from './sections/FinalScene';
import { Footer } from './sections/Footer';

export default function App({ initialTier = 'full' }) {
  const [tier, setTier] = useState(initialTier);
  const [poster, setPoster] = useState(false);

  useEffect(() => {
    setTier(getMotionTier());
    return onTierChange(setTier);
  }, []);

  // Timeline maestra: se construye cuando el layout es definitivo y se reconstruye al redimensionar.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let master = null;
    let raf = 0;
    let alive = true;
    const build = () => {
      if (!alive) return;
      master?.kill();
      ScrollTrigger.refresh();
      master = buildMaster(tier);
      ScrollTrigger.refresh();
      if (new URLSearchParams(location.search).has('debug')) window.__master = master;
    };
    document.fonts.ready.then(() => { raf = requestAnimationFrame(build); });
    let w = innerWidth, h = innerHeight, t;
    const onResize = () => {
      // En móvil la barra de direcciones cambia la altura: solo reconstruimos con cambios reales.
      if (Math.abs(innerWidth - w) < 2 && Math.abs(innerHeight - h) < 120) return;
      w = innerWidth; h = innerHeight;
      clearTimeout(t); t = setTimeout(build, 200);
    };
    window.addEventListener('resize', onResize);
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener('resize', onResize); master?.kill(); };
  }, [tier]);

  return (
    <TierContext.Provider value={tier}>
      <a className="skip" href="#main">Skip to content</a>
      <Scene3D tier={tier} posterVisible={poster} />
      <div className="cut-veil" aria-hidden="true" />
      <AnnotationLayer />
      <ScrollProgress />
      <main id="main" tabIndex={-1}>
        <HeroScene onPosterNeeded={setPoster} />
        <FormScene />
        <AerodynamicsScene />
        <WingScene />
        <WheelScene />
        <MacroScene />
        <CockpitScene />
        <ExplodedScene />
        <PerformanceNumbers />
        <ControlScene />
        <FinalScene />
      </main>
      <Footer />
      <CursorInteraction />
      <PageTransition />
    </TierContext.Provider>
  );
}
