/**
 * TIMELINE MAESTRA — un único progreso de scroll para cámara, coche, luz y aire.
 * El tiempo de la timeline está en píxeles de scroll: time === scrollY.
 */
import { gsap, ScrollTrigger } from '../motion/gsap';
import { director, DEFAULTS } from './director';
import { getChoreography, STILL_AT } from './choreography';
import { MOTION } from '../motion/motion.config';

const DEBUG_NOSCRUB = typeof window !== 'undefined' && new URLSearchParams(location.search).has('noscrub');
const CAMERA = new Set(['az', 'el', 'dist', 'tx', 'ty', 'tz', 'fov', 'fit']);
const easeFor = (prop) => {
  if (prop === 'spin' || prop === 'air' || prop.startsWith('a_') || prop === 'g_tags') return 'none';
  if (CAMERA.has(prop)) return MOTION.ease.camera;
  return 'power2.inOut';
};

function measure() {
  const vh = window.innerHeight;
  const ranges = {};
  document.querySelectorAll('[data-scene]').forEach((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    const start = top;
    const end = Math.max(start + 1, top + el.offsetHeight - vh);
    ranges[el.dataset.scene] = { start, end };
  });
  return ranges;
}

export function buildMaster(tier) {
  const choreo = getChoreography(tier);
  const ranges = measure();
  const max = ScrollTrigger.maxScroll(window);
  const tracks = {};
  for (const [id, keys] of Object.entries(choreo)) {
    const r = ranges[id];
    if (!r) continue;
    for (const { t, ease, ...props } of keys) {
      const px = r.start + t * (r.end - r.start);
      for (const [p, v] of Object.entries(props)) (tracks[p] ||= []).push({ px, v, ease });
    }
  }
  const tl = gsap.timeline({ paused: true });
  for (const [p, arr] of Object.entries(tracks)) {
    arr.sort((a, b) => a.px - b.px);
    tl.set(director, { [p]: arr[0].v }, 0);
    for (let i = 1; i < arr.length; i++) {
      const a = arr[i - 1], b = arr[i];
      if (b.px - a.px < 0.5) continue;
      tl.fromTo(director, { [p]: a.v }, { [p]: b.v, duration: b.px - a.px, ease: b.ease || easeFor(p), immediateRender: false }, a.px);
    }
  }
  tl.set({}, {}, Math.max(max, 1));

  let trigger;
  if (tier === 'static') {
    // Movimiento reducido: cortes de plano con fundido a negro, sin scrub.
    const veil = document.querySelector('.cut-veil');
    const cutTo = (id) => {
      const r = ranges[id]; if (!r) return;
      const px = r.start + (STILL_AT[id] ?? 0.5) * (r.end - r.start);
      gsap.timeline()
        .to(veil, { opacity: 1, duration: MOTION.duration.cut / 2 })
        .add(() => tl.seek(px))
        .to(veil, { opacity: 0, duration: MOTION.duration.cut });
    };
    const triggers = Object.keys(ranges).map((id) => ScrollTrigger.create({
      trigger: `[data-scene="${id}"]`, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => self.isActive && cutTo(id),
    }));
    const r0 = ranges.hero; tl.seek(r0 ? r0.start : 0);
    trigger = { kill: () => triggers.forEach((t) => t.kill()) };
  } else {
    trigger = ScrollTrigger.create({
      start: 0, end: 'max', animation: tl,
      scrub: DEBUG_NOSCRUB ? true : tier === 'full' ? MOTION.scrub.full : MOTION.scrub.lite,
    });
  }
  return { tl, trigger, ranges, kill: () => { trigger.kill(); tl.kill(); } };
}

export function resetToDefaults() { Object.assign(director, DEFAULTS); }
