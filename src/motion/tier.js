// Elige el nivel de experiencia según las capacidades del dispositivo.
export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

export function getMotionTier() {
  if (typeof window === 'undefined') return 'full';
  const q = new URLSearchParams(location.search).get('tier');
  if (q) return q; // depuración: ?tier=lite|static|static-lite
  if (!hasWebGL()) return 'static-lite';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 2 || (navigator.deviceMemory ?? 8) <= 2 || navigator.connection?.saveData;
  if (weak) return 'static-lite';
  if (reduced) return 'static';
  const touch = matchMedia('(pointer: coarse)').matches || innerWidth < 768;
  return touch ? 'lite' : 'full';
}

export function onTierChange(callback) {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const handler = () => callback(getMotionTier());
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
