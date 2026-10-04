/**
 * DIRECTOR — estado único de la película.
 *
 * GSAP anima SOLO estos números planos (timeline maestra ligada al scroll + intro por tiempo).
 * React Three Fiber los LEE en cada fotograma y es el único que escribe transforms 3D,
 * luces, materiales y la capa de anotaciones proyectadas. Nunca dos motores sobre el mismo transform.
 */
export const DEFAULTS = {
  // Cámara orbital: az (grados, 0 = frontal, 90 = costado izquierdo +X, 180 = trasera), el (grados), dist (m)
  az: 24, el: 4, dist: 8.6, tx: 0, ty: 0.62, tz: 0.05, fov: 28, fit: 1,
  // Desplazamiento óptico (lens shift): deja espacio negativo para el texto sin cambiar la perspectiva.
  shift: 0,
  // Luz
  env: 1, key: 1, keyAz: 35, keyEl: 40, rim: 1, strip: 1, sweep: -1, sweepI: 0,
  head: 1, interior: 0, exposure: 1, dim: 0,
  // Rigs del coche
  wingLift: 0, flap: 0, spin: 0, wheelOut: 0, glassL: 1,
  e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0, e7: 0, xray: 0,
  // Aire
  air: 0, airO: 0, airSpeed: 1, force: 0, forceVal: 0,
  // Anotaciones (opacidad 0–1)
  a_splitter: 0, a_nostrils: 0, a_louvres: 0, a_carbon: 0, a_roofline: 0,
  a_neck: 0, a_drs: 0, a_disc: 0, a_caliper: 0,
  a_wheel: 0, a_gauges: 0, a_seat: 0,
  g_tags: 0,
};

export const director = { ...DEFAULTS };

// Intro del hero (por tiempo). Multiplica a la luz del director: 0 = negro.
export const intro = { strip: 0, stripW: 0, rim: 0, env: 0, key: 0, head: 0, done: false };

// Bandera de "algo ha cambiado" para el render bajo demanda.
export const frame = { dirty: true, flowing: false };

export function resetDirector() {
  Object.assign(director, DEFAULTS);
}

if (typeof window !== 'undefined' && new URLSearchParams(location.search).has('debug')) {
  window.__dir = director; window.__intro = intro;
}
