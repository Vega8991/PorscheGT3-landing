/**
 * Prepara el GLB para la película sin fusionar nada:
 *  - Reparenta los 103 objetos de primer nivel a un grupo limpio (ejes del mundo, suelo en y = 0).
 *  - Crea pivotes reales: 4 esquinas de rueda (llanta + neumático + disco giran, pinza fija),
 *    alerón (elevación), elemento superior/flap (giro en su borde de ataque) y cuellos de cisne (estiran).
 *  - Clasifica cada objeto en las 7 capas de la exploded view con un vector de separación.
 */
import * as THREE from 'three';

const san = (n) => THREE.PropertyBinding.sanitizeNodeName(n);
export const GROUND = 0.084; // los neumáticos del GLB llegan a y = -0.084

const P = 'TwiXeR_992_';
const CORNERS = [
  { id: 'FL', rim: `${P}gt3rs_style_1_chrome_wheels_20x9`, tire: 'Object_4.003', brake: 'amdb11_brakedisc_FR.003' },
  { id: 'RL', rim: `${P}gt3rs_style_1_chrome_wheels_20x9.001`, tire: 'Object_4.001', brake: 'amdb11_brakedisc_FR.001' },
  { id: 'FR', rim: `${P}gt3rs_style_1_chrome_wheels_20x9.002`, tire: 'Object_4.002', brake: 'amdb11_brakedisc_FR.002' },
  { id: 'RR', rim: `${P}gt3rs_style_1_chrome_wheels_20x9.003`, tire: 'Object_4.004', brake: 'amdb11_brakedisc_FR.004' },
];

const GLASS = ['windshield', 'backlight_tint', 'doorglass_L_tint', 'doorglass_R_tint', 'quarterglass_L', 'quarterglass_R_tint',
  'headlightglass_L_led', 'headlightglass_R_led', 'body_chrome_end'];
const AERO = ['gt3rs_carbon_Wing', 'gt3rs_left_leg', 'gt3rs_right_leg', 'gt3rs_spoiler', 'underbody_gt3rs'];
const INTERIOR = ['seat_FL', 'seat_FR', 'dash_9000', 'dash_clock', 'steer_3', 'needle_tacho_9000', 'gauges_screen',
  'shifter_A', 'gaspedal', 'brakepedal', 'signalstalk', 'black_dash_accessories'];
const CHASSIS = ['subframe_F', 'subframe_R', 'upperarm_F', 'upperarm_R', 'lowerarm_F', 'lowerarm_R', 'trailingarm_R',
  'pushrod_R', 'pushrod_triangle_R', 'tierod_F', 'swaybar_F', 'swaybar_R', 'coilover_F', 'coilover_RL', 'coilover_RR',
  'hub_F', 'hub_R', 'steeringbox', 'halfshaft_F', 'halfshaft_R', 'halfshaft_e_F', 'halfshaft_e_R', 'bumperbar_F',
  'bumperbar_R', 'brakelines'];
const MECH = ['engine', 'transaxle', 'intake_TT', 'exhaust', 'exhaust_TT', 'muffler', 'muffler_custom', 'heatshield',
  'radiator', 'radiators_small', 'coolantlines', 'fueltank', 'fuellines', 'driveshaft', 'diff_F', 'exhausttip_3_antichrome'];

export const LAYERS = ['glass', 'body', 'aero', 'wheels', 'interior', 'chassis', 'mech'];

function layerOf(name) {
  const short = name.replace(san(P), '');
  const is = (list) => list.some((n) => short === san(n));
  if (is(GLASS)) return 'glass';
  if (is(AERO)) return 'aero';
  if (is(INTERIOR)) return 'interior';
  if (is(CHASSIS)) return 'chassis';
  if (is(MECH)) return 'mech';
  return 'body';
}

const box = new THREE.Box3();
const v = new THREE.Vector3();

function centerOf(obj) {
  box.setFromObject(obj);
  return { center: box.getCenter(new THREE.Vector3()), size: box.getSize(new THREE.Vector3()), min: box.min.clone(), max: box.max.clone() };
}

function explodeVector(layer, c) {
  const o = new THREE.Vector3();
  const sx = Math.sign(c.x) || 1;
  const sz = Math.sign(c.z) || 1;
  switch (layer) {
    case 'glass': o.set(Math.abs(c.x) > 0.5 ? sx * 0.14 : 0, 2.7, 0); break;
    case 'body':
      o.set(Math.abs(c.x) > 0.5 ? sx * 0.42 : 0, 1.75, Math.abs(c.z) > 1.6 ? sz * 0.42 : 0); break;
    case 'aero': o.set(0, 1.75, -1.15); break;
    case 'interior': o.set(0, 0.85, 0); break;
    case 'chassis': o.set(Math.abs(c.x) > 0.3 ? sx * 0.22 : 0, 0, 0); break;
    case 'mech': o.set(0, -0.75, 0); break;
    default: break;
  }
  return o;
}

export function buildRig(gltfScene) {
  gltfScene.updateMatrixWorld(true);
  const root = gltfScene.getObjectByName('RootNode');
  const car = new THREE.Group();
  car.name = 'car';
  const byName = new Map();
  gltfScene.traverse((o) => byName.set(o.name, o));
  const get = (n) => byName.get(san(n)) ?? car.getObjectByName(n);

  // 1 · Reparentado a ejes del mundo (car en identidad durante el rigging).
  const tops = [...root.children];
  for (const o of tops) car.attach(o);
  car.updateMatrixWorld(true);

  const movers = []; // { obj, base, layer, offset }
  const addMover = (obj, layer, offset) => movers.push({ obj, base: obj.position.clone(), layer, offset });

  // 2 · Esquinas de rueda
  const corners = [];
  for (const c of CORNERS) {
    const rim = get(c.rim), tire = get(c.tire), brake = get(c.brake);
    if (!rim || !tire || !brake) continue;
    const { center } = centerOf(tire);
    const corner = new THREE.Group(); corner.name = `corner_${c.id}`;
    corner.position.copy(center); car.add(corner); corner.updateMatrixWorld(true);
    const spin = new THREE.Group(); spin.name = `spin_${c.id}`; corner.add(spin);
    const outer = new THREE.Group(); outer.name = `outer_${c.id}`; spin.add(outer);
    corner.updateMatrixWorld(true);
    const disc = brake.children.find((m) => m.name.includes('amdb11_brake002')) ?? null;
    corner.attach(brake);
    outer.attach(rim); outer.attach(tire);
    if (disc) spin.attach(disc);
    const side = Math.sign(center.x) || 1;
    corners.push({ id: c.id, corner, spin, outer, side, brake, disc });
    addMover(corner, 'wheels', new THREE.Vector3(side * 1.05, 0, 0));
  }

  // 3 · Alerón: elevación + flap (DRS) + cuellos de cisne que se estiran
  const wingObj = get(`${P}gt3rs_carbon_Wing`);
  let wing = null;
  if (wingObj) {
    const flap = wingObj.children.find((m) => m.name.includes('carbon_roof001'));
    const legs = [];
    for (const ln of [`${P}gt3rs_left_leg`, `${P}gt3rs_right_leg`]) {
      const leg = get(ln); if (!leg) continue;
      const b = centerOf(leg);
      const pivot = new THREE.Group(); pivot.name = `${leg.name}_pivot`;
      pivot.position.set(b.center.x, b.min.y, b.center.z); car.add(pivot); pivot.updateMatrixWorld(true);
      pivot.attach(leg);
      legs.push({ pivot, h: b.size.y });
      addMover(pivot, 'aero', explodeVector('aero', b.center));
    }
    let flapPivot = null, flapBase = null;
    if (flap) {
      const b = centerOf(flap);
      flapPivot = new THREE.Group(); flapPivot.name = 'flap_pivot';
      flapPivot.position.set(0, b.center.y, b.max.z); car.add(flapPivot); car.updateMatrixWorld(true);
      wingObj.attach(flapPivot); flapPivot.attach(flap);
      flapBase = flapPivot.quaternion.clone();
    }
    wing = { obj: wingObj, base: wingObj.position.clone(), legs, flapPivot, flapBase, flap };
  }

  // 4 · Capas de la exploded view
  const layers = Object.fromEntries(LAYERS.map((l) => [l, []]));
  for (const o of tops) {
    if (!o.parent || o.parent !== car) continue; // ya colgado de un pivote
    const layer = layerOf(o.name);
    const { center } = centerOf(o);
    // El fondo plano es aerodinámica, pero se separa hacia abajo: es la base de la pila.
    const off = o.name.includes('underbody') ? new THREE.Vector3(0, -1.45, 0) : explodeVector(layer, center);
    addMover(o, layer, off);
  }
  for (const m of movers) layers[m.layer].push(m.obj);

  const doorGlassL = get(`${P}doorglass_L_tint`);

  // Suelo en y = 0
  car.position.y = GROUND;
  car.updateMatrixWorld(true);

  return { car, get, corners, wing, movers, layers, doorGlassL };
}

// Puntos de anclaje para anotaciones: punto local en el espacio del objeto a seguir.
export function makeAnchor(rig, { node, frac = [0.5, 0.5, 0.5], follow }) {
  const target = typeof node === 'string' ? rig.get(node) : node;
  if (!target) return null;
  const followObj = (typeof follow === 'string' ? rig.get(follow) : follow) || target;
  rig.car.updateMatrixWorld(true);
  box.setFromObject(target);
  v.set(
    THREE.MathUtils.lerp(box.min.x, box.max.x, frac[0]),
    THREE.MathUtils.lerp(box.min.y, box.max.y, frac[1]),
    THREE.MathUtils.lerp(box.min.z, box.max.z, frac[2]),
  );
  const local = followObj.worldToLocal(v.clone());
  return { obj: followObj, local };
}
