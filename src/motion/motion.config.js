// Único origen de los valores de movimiento. Ninguna animación escribe números a mano.
export const MOTION = {
  duration: { micro: 0.2, base: 0.6, slow: 1.0, cinematic: 1.6, cut: 0.4 },
  ease: { out: 'power3.out', inOut: 'power2.inOut', expo: 'expo.out', linear: 'none', camera: 'sine.inOut' },
  stagger: { tight: 0.04, base: 0.08, loose: 0.14 },
  reveal: { y: 24, start: 'top 80%' },
  scrub: { full: 1.1, lite: 0.6 },
  pin: { min: 1.5, max: 3 },
  magnetic: { strength: 0.28 },
  spring: { ui: { stiffness: 260, damping: 26 }, soft: { stiffness: 120, damping: 20 } },
  cursor: { lag: 0.18 },
  dpr: { full: [1, 2], lite: [1, 1.5] },
  // Intro del hero (segundos). Porcentajes del brief: 0 negro · 15 línea · 30 silueta · 50 carrocería · 70 detalles · 85 identidad · 100 claim
  intro: { total: 4.2 },
  wing: { lift: 0.03, flapDeg: -7 },          // metros / grados: ingeniería, no espectáculo
  wheel: { slide: 0.3, turns: 3.2 },          // metros / vueltas por escena
};

// Factores por nivel. Las escenas multiplican sus longitudes por `pin` y eligen variantes.
export const TIER_SCALE = {
  full: { pin: 1, flowLines: 'full', annotations: true, cursor: true, webgl: true },
  lite: { pin: 0.66, flowLines: 'all', annotations: true, cursor: false, webgl: true },
  static: { pin: 0.66, flowLines: 'all', annotations: true, cursor: false, webgl: true },
  'static-lite': { pin: 0.5, flowLines: 'none', annotations: false, cursor: false, webgl: false },
};
