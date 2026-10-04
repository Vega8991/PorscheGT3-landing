/**
 * Cámara cinematográfica: lee az/el/dist/target/fov del director (animados por la timeline maestra)
 * y compensa el encuadre en pantallas verticales (`fit`) en lugar de recortar el coche.
 */
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { director } from '../scroll/director';

const REF_ASPECT = 1.6;
const target = new THREE.Vector3();

export function CameraRig() {
  const { camera, size } = useThree();
  useFrame(() => {
    const d = director;
    const aspect = size.width / size.height;
    const fitFactor = 1 + Math.max(0, REF_ASPECT / aspect - 1) * 0.8 * d.fit;
    const r = d.dist * fitFactor;
    const az = THREE.MathUtils.degToRad(d.az);
    const el = THREE.MathUtils.degToRad(d.el);
    target.set(d.tx, d.ty, d.tz);
    camera.position.set(
      d.tx + Math.sin(az) * Math.cos(el) * r,
      d.ty + Math.sin(el) * r,
      d.tz + Math.cos(az) * Math.cos(el) * r,
    );
    camera.lookAt(target);
    // Lens shift: en horizontal el coche se desplaza a la derecha; en vertical, hacia arriba (texto abajo).
    const w = size.width, h = size.height;
    const sx = aspect >= 1 ? -d.shift * w : 0;
    const sy = aspect >= 1 ? 0 : d.shift * h * 1.1;
    const view = camera.view;
    if (d.fov !== camera.fov || !view || Math.abs(view.offsetX - sx) > 0.5 || Math.abs(view.offsetY - sy) > 0.5 || view.fullWidth !== w || view.fullHeight !== h) {
      camera.fov = d.fov;
      camera.setViewOffset(w, h, sx, sy, w, h);
      camera.updateProjectionMatrix();
    }
  }, -2);
  return null;
}
