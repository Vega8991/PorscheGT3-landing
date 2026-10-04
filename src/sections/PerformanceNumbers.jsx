/**
 * THE MACHINE — cifras verificadas. Cada número entra por máscara + tracking + escala;
 * su contexto aparece después. El valor final está en el HTML desde el principio (sin contadores).
 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { MOTION } from '../motion/motion.config';
import { NUMBERS } from '../content/story';
import { TextReveal } from '../components/TextReveal';
import { useTier } from '../components/TierContext';

export function PerformanceNumbers() {
  const ref = useRef(null);
  const tier = useTier();
  useGSAP(() => {
    ref.current.querySelectorAll('.figure-xl').forEach((fig) => {
      const digits = fig.querySelector('.figure-xl__digits');
      const unit = fig.querySelector('.figure-xl__unit');
      const ctx = fig.querySelector('.figure-xl__context');
      const st = { trigger: fig, start: 'top 62%', toggleActions: 'play none none reverse' };
      if (tier === 'static') {
        gsap.from([digits, unit, ctx], { opacity: 0, duration: MOTION.duration.base, stagger: MOTION.stagger.base, scrollTrigger: st });
        return;
      }
      gsap.timeline({ scrollTrigger: st })
        .from(digits, { yPercent: 100, duration: MOTION.duration.cinematic, ease: MOTION.ease.expo })
        .from(digits, { letterSpacing: '0.12em', duration: MOTION.duration.cinematic, ease: MOTION.ease.expo }, 0)
        .from(unit, { opacity: 0, x: -12, duration: MOTION.duration.slow, ease: MOTION.ease.out }, 0.5)
        .from(ctx, { opacity: 0, y: 14, duration: MOTION.duration.slow, ease: MOTION.ease.out }, 0.8);
      // La escala acompaña al scroll mientras la cifra cruza el viewport: el número "pesa".
      gsap.fromTo(fig.querySelector('.figure-xl__value'), { scale: 0.94 }, {
        scale: 1, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'center center', scrub: true },
      });
    });
  }, { scope: ref, dependencies: [tier] });

  return (
    <section ref={ref} id="numbers" data-scene="numbers" className="numbers" aria-labelledby="numbers-title">
      <div className="numbers__head">
        <p className="eyebrow"><b>08</b>{NUMBERS.eyebrow}</p>
        <TextReveal className="h2" id="numbers-title">{NUMBERS.title}</TextReveal>
      </div>
      <dl style={{ margin: 0 }}>
        {NUMBERS.items.map((n) => (
          <div className="figure-xl" key={n.unit}>
            <dt className="sr-only">{n.context}</dt>
            <dd style={{ margin: 0, display: 'contents' }}>
              <p className="figure-xl__value">
                <span className="line-mask"><span className="figure-xl__digits">{n.value}</span></span>
                <span className="figure-xl__unit">{n.unit}</span>
              </p>
              <p className="figure-xl__context">{n.context}</p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
