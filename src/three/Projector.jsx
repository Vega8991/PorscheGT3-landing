import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ANCHORS } from './anchors';
import { makeAnchor } from './rig';
import { director } from '../scroll/director';
import { annotationEls } from '../components/annotationRegistry';

const p1 = new THREE.Vector3(), p2 = new THREE.Vector3();

/** Proyecta los anclajes 3D a pantalla y escribe transform/opacidad en la capa DOM. */
export function Projector({ rig }) {
  const { camera, size } = useThree();
  const anchors = useMemo(() => ANCHORS.map((a) => ({
    ...a,
    A: makeAnchor(rig, a),
    B: a.node2 ? makeAnchor(rig, { node: a.node2, frac: a.frac2 }) : null,
  })).filter((a) => a.A), [rig]);

  useFrame(() => {
    for (const a of anchors) {
      const el = annotationEls.get(a.id);
      if (!el) continue;
      const o = director[a.key] ?? 0;
      if (o <= 0.001) { if (el.style.opacity !== '0') el.style.opacity = '0'; continue; }
      p1.copy(a.A.local); a.A.obj.localToWorld(p1); p1.project(camera);
      if (p1.z > 1) { el.style.opacity = '0'; continue; }
      const x = (p1.x * 0.5 + 0.5) * size.width;
      const y = (-p1.y * 0.5 + 0.5) * size.height;
      el.style.opacity = String(o);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (a.kind === 'level' && a.B) {
        p2.copy(a.B.local); a.B.obj.localToWorld(p2); p2.project(camera);
        const x2 = (p2.x * 0.5 + 0.5) * size.width;
        const y2 = (-p2.y * 0.5 + 0.5) * size.height;
        el.style.setProperty('--len', `${(x2 - x).toFixed(1)}`);
        el.style.setProperty('--rise', `${(y2 - y).toFixed(1)}`);
      }
      if (a.kind === 'force') el.style.setProperty('--force', (0.55 + 0.45 * director.forceVal).toFixed(3));
    }
  });
  return null;
}
