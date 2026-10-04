/**
 * CHOREOGRAPHY — la película entera en un solo archivo.
 *
 * Cada escena declara keyframes en tiempo local t ∈ [0, 1] (0 = la escena queda fijada,
 * 1 = la escena empieza a soltarse). La timeline maestra convierte t en píxeles de scroll
 * según la posición real de cada sección y crea un fromTo por propiedad entre keyframes
 * consecutivos. Entre escenas, la cámara interpola durante el viewport de transición.
 *
 * Coordenadas: metros, suelo en y = 0, +Z = morro, +X = costado izquierdo (conductor, LHD).
 */
import { MOTION } from '../motion/motion.config';

const cam = (az, el, dist, [tx, ty, tz], fov = 28, fit = 1) => ({ az, el, dist, tx, ty, tz, fov, fit });
const TAU = Math.PI * 2;

// Anotación visible entre a y b con fundidos cortos.
const show = (key, a, b, f = 0.03) => [
  { t: Math.max(0, a - f), [key]: 0 },
  { t: a, [key]: 1 },
  { t: b, [key]: 1 },
  { t: Math.min(1, b + f), [key]: 0 },
];

export function getChoreography(tier) {
  const lite = tier !== 'full';

  return {
    // ─── CAR ─────────────────────────────────────────────────────────────
    hero: [
      { t: 0, ...cam(26, 5, 7.4, [0, 0.42, 0.05], 28, 0.75), shift: 0, strip: 1, env: 1, rim: 1, key: 1, head: 1, keyAz: 35, keyEl: 40 },
      { t: 1, ...cam(10, 3, 8.2, [0, 0.6, 0.15], 28), strip: 0, shift: 0.1 },
    ],

    // ─── FORM: Every line has a reason ───────────────────────────────────
    form: [
      { t: 0, ...cam(0, 3, 7.6, [0, 0.55, 0.3], 27) },
      ...show('a_splitter', 0.04, 0.12),
      { t: 0.17, ...cam(14, 34, 3.7, [0, 0.78, 1.45], 30, 0.6) },
      ...show('a_nostrils', 0.2, 0.28),
      { t: 0.33, ...cam(58, 10, 3.4, [0.72, 0.62, 1.18], 30, 0.6) },
      ...show('a_louvres', 0.36, 0.45),
      { t: 0.5, ...cam(108, 34, 4.4, [0.1, 1.25, -0.35], 30, 0.6) },
      ...show('a_carbon', 0.53, 0.61),
      { t: 0.67, ...cam(90, 1, 8.2, [0, 0.8, -0.5], 22) },
      ...show('a_roofline', 0.69, 0.79),
      { t: 0.83, ...cam(158, 10, 7.8, [0, 0.8, -0.6], 28) },
      { t: 1, ...cam(90, 82, lite ? 11.5 : 10.5, [0, 0.4, -0.1], 28) },
    ],

    // ─── AERODYNAMICS: Sculpted by air ───────────────────────────────────
    aero: [
      { t: 0, ...cam(90, 5, 10.4, [0, 0.72, -0.25], 26), air: 0, airO: 0, airSpeed: 1, force: 0, forceVal: 0, keyAz: 35 },
      { t: 0.04, airO: 1 },
      { t: 0.46, air: 1, ease: 'power1.inOut' },
      { t: 0.55, force: 0, forceVal: 0 },
      { t: 0.66, force: 1 },
      { t: 0.9, forceVal: 1, airSpeed: 2.2 },
      { t: 1, ...cam(80, 8, 9.8, [0, 0.74, -0.4], 26), force: 1 },
    ],

    // ─── DOWNFORCE: Air becomes grip ─────────────────────────────────────
    wing: [
      { t: 0, ...cam(140, 14, 4.3, [0, 1.15, -1.95], 28, 0.6), airO: 0.38, force: 0, wingLift: 0, flap: 0 },
      { t: 0.28, ...cam(132, 10, lite ? 3.0 : 2.4, [0.25, 1.22, -2.05], 26, 0.3) },
      { t: 0.32, wingLift: 0 },
      { t: 0.5, wingLift: 1 },
      ...show('a_neck', 0.5, 0.68),
      { t: 0.56, flap: 0 },
      { t: 0.72, flap: 1 },
      ...show('a_drs', 0.72, 0.95),
      { t: 1, ...cam(122, 6, lite ? 2.8 : 2.2, [0.45, 1.2, -2.1], 24, 0.3), airO: 0.38 },
    ],

    // ─── DETAIL: Controlled at every corner ──────────────────────────────
    wheels: [
      { t: 0, ...cam(72, 4, 3.4, [0.8, 0.42, 1.15], 28, 0.5), spin: 0, wheelOut: 0, airO: 0, wingLift: 1, flap: 1 },
      { t: 0.2, wingLift: 0, flap: 0 },
      { t: 0.3, wheelOut: 0 },
      { t: 0.55, ...cam(48, 10, 2.1, [1.0, 0.42, 1.12], 26, 0.3), wheelOut: 1 },
      ...show('a_disc', 0.57, 0.76),
      { t: 0.8, ...cam(80, 14, lite ? 1.6 : 1.2, [0.86, 0.4, 1.0], 24, 0.2) },
      ...show('a_caliper', 0.82, 0.98),
      { t: 1, spin: MOTION.wheel.turns * TAU, ease: 'none', wheelOut: 1 },
    ],

    // ─── DETAIL: macro sequence (cámara física, sin cortes) ──────────────
    macro: lite
      ? [
          { t: 0, ...cam(28, 4, 1.7, [0.7, 0.76, 1.66], 26, 0.3), wheelOut: 0, sweep: -1, sweepI: 1 },
          { t: 0.3, sweep: 1 },
          { t: 0.4, ...cam(60, 30, 3.2, [0.3, 1.0, 0.4], 28, 0.4), sweep: -1 },
          { t: 0.55, ...cam(95, 40, 1.7, [0.35, 1.38, -0.45], 26, 0.3) },
          { t: 0.7, sweep: 1 },
          { t: 0.8, ...cam(140, 20, 3.4, [0, 0.8, -1.6], 28, 0.4), sweep: -1 },
          { t: 1, ...cam(170, 5, 1.8, [0, 0.36, -2.2], 26, 0.3), sweep: 1, sweepI: 1 },
        ]
      : [
          { t: 0, ...cam(28, 4, 1.3, [0.7, 0.76, 1.66], 24, 0.2), wheelOut: 0, sweep: -1, sweepI: 1 },
          { t: 0.18, sweep: 1 },
          { t: 0.2, ...cam(16, 22, 3.0, [0.35, 0.78, 1.6], 28, 0.3), sweep: -1 },
          { t: 0.32, ...cam(4, 42, 1.25, [0, 0.79, 1.58], 24, 0.2) },
          { t: 0.46, sweep: 1 },
          { t: 0.48, ...cam(60, 34, 3.2, [0.2, 1.1, 0.5], 28, 0.3), sweep: -1 },
          { t: 0.62, ...cam(95, 40, 1.25, [0.35, 1.38, -0.45], 24, 0.2) },
          { t: 0.75, sweep: 1 },
          { t: 0.78, ...cam(140, 22, 3.4, [0, 0.9, -1.6], 28, 0.3), sweep: -1 },
          { t: 1, ...cam(170, 5, 1.35, [0, 0.36, -2.2], 24, 0.2), sweep: 1, sweepI: 1 },
        ],

    // ─── CONTROL: Built around the driver ────────────────────────────────
    cockpit: [
      { t: 0, ...cam(92, 4, 2.6, [0.5, 0.98, -0.05], 32, 0.4), shift: 0.1, env: 1, interior: 0, glassL: 1, sweepI: 0, keyAz: 35 },
      { t: 0.16, env: 0.55, key: 0.4 },
      { t: 0.2, glassL: 0, ease: 'none' },
      { t: 0.3, ...cam(112, 16, 0.75, [0.344, 0.86, 0.15], 36, 0), interior: 1, shift: 0 },
      { t: 0.5, ...cam(180, 26, 0.52, [0.344, 0.86, 0.19], 38, 0) },
      ...show('a_wheel', 0.5, 0.62),
      { t: 0.7, ...cam(180, 14, 0.36, [0.345, 0.91, 0.37], 30, 0) },
      ...show('a_gauges', 0.72, 0.84),
      { t: 0.94, ...cam(310, 19, 0.78, [0.344, 0.8, -0.2], 34, 0) },
      ...show('a_seat', 0.93, 0.97, 0.02),
      { t: 1, interior: 1, env: 0.55, key: 0.4 },
    ],

    // ─── ENGINEERING: exploded view (cámara estable) ─────────────────────
    exploded: [
      { t: 0, ...cam(36, 16, lite ? 17 : 14, [0, 1.25, -0.1], 30, 0.45), shift: 0.12, env: 1, key: 1, interior: 0, glassL: 1,
        e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0, e7: 0, g_tags: 0, xray: 0 },
      { t: 0.06, e1: 0 }, { t: 0.26, e1: 1 },
      { t: 0.16, e2: 0 }, { t: 0.4, e2: 1 },
      { t: 0.3, e3: 0 }, { t: 0.5, e3: 1 },
      { t: 0.4, e4: 0 }, { t: 0.6, e4: 1 },
      { t: 0.5, e5: 0 }, { t: 0.7, e5: 1 },
      { t: 0.6, e6: 0 }, { t: 0.78, e6: 1 },
      { t: 0.7, e7: 0 }, { t: 0.88, e7: 1 },
      { t: 0.2, g_tags: 0 }, { t: 0.3, g_tags: 1 },
      { t: 1, ...cam(36, 15, lite ? 19.5 : 16.5, [0, 1.45, -0.1], 30, 0.45), g_tags: 1 },
    ],

    technical: [
      { t: 0, ...cam(36, 15, lite ? 19.5 : 16.5, [0, 1.45, -0.1], 30, 0.45), xray: 0, g_tags: 1, env: 1, key: 1 },
      { t: 0.15, g_tags: 0 },
      { t: 0.4, xray: 1, env: 0.6, key: 1.4 },
      { t: 1, ...cam(62, 22, lite ? 17 : 14, [0, 1.15, -0.2], 30, 0.45), xray: 1 },
    ],

    // ─── THE MACHINE ─────────────────────────────────────────────────────
    numbers: [
      { t: 0, dim: 0 },
      { t: 0.08, dim: 0.84, xray: 1 },
      { t: 0.9, dim: 0.96, xray: 0, shift: 0, ...cam(90, 3, lite ? 19 : 16, [0, 0.55, -0.1], 26), env: 0.3, key: 0.25, rim: 0.8 },
    ],

    control: [
      { t: 0, dim: 0.5, ...cam(90, 3, lite ? 19 : 16, [0, 0.55, -0.1], 26), env: 0.3, key: 0.25, rim: 0.8 },
      { t: 1, dim: 0.45, ...cam(88, 4, lite ? 18.6 : 15.6, [0, 0.55, -0.1], 26) },
    ],

    final: [
      { t: 0, dim: 0.45, env: 0.3, key: 0.25, keyAz: 35, keyEl: 40 },
      { t: 0.08, e7: 1 }, { t: 0.22, e7: 0 },
      { t: 0.14, e6: 1 }, { t: 0.3, e6: 0 },
      { t: 0.2, e5: 1 }, { t: 0.38, e5: 0 },
      { t: 0.26, e4: 1 }, { t: 0.44, e4: 0 },
      { t: 0.32, e3: 1 }, { t: 0.5, e3: 0 },
      { t: 0.38, e2: 1 }, { t: 0.58, e2: 0 },
      { t: 0.46, e1: 1 }, { t: 0.64, e1: 0 },
      { t: 0.15, dim: 0.2 },
      { t: 0.7, ...cam(80, 2, 8.4, [0, 0.42, 0], 26), shift: 0.1, dim: 0, env: 0.32, key: 2.2, keyAz: 12, keyEl: 12, rim: 0.8, head: 1 },
      { t: 1, ...cam(78, 2, 8.2, [0, 0.42, 0], 26) },
    ],
  };
}

// Plano representativo de cada escena para el modo de movimiento reducido (cortes, sin scrub).
export const STILL_AT = {
  hero: 0, form: 0.67, aero: 0.92, wing: 0.95, wheels: 0.9, macro: 0, cockpit: 0.5,
  exploded: 1, technical: 1, numbers: 0.95, control: 0.5, final: 1,
};
