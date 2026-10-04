/**
 * El GT3 RS: carga el GLB optimizado (meshopt + WebP), monta los rigs y aplica cada fotograma
 * el estado del director a los transforms. R3F es el único dueño de estos transforms.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import { buildRig } from './rig';
import { applyMaterials, setXray, emissives } from './materials';
import { director, intro } from '../scroll/director';
import { MOTION } from '../motion/motion.config';
import { Projector } from './Projector';

export const MODEL_URL = '/models/GT3RS.glb';

const qx = new THREE.Quaternion();
const X = new THREE.Vector3(1, 0, 0);

export function CarModel({ onReady }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL, (l) => l.setMeshoptDecoder(MeshoptDecoder));
  const { gl } = useThree();
  const xrayState = useRef({ on: false });

  const { rig, xrayMats } = useMemo(() => {
    const rig = buildRig(gltf.scene);
    const xrayMats = applyMaterials(rig);
    return { rig, xrayMats };
  }, [gltf]);

  useEffect(() => {
    // Sube texturas y compila shaders antes del primer fotograma visible (sin tirones en la intro).
    gl.initTexture && rig.car.traverse((o) => o.material?.map && gl.initTexture(o.material.map));
    onReady?.();
    return () => {
      rig.car.traverse((o) => {
        if (!o.isMesh) return;
        o.geometry.dispose();
        const m = o.material;
        ['map', 'normalMap', 'emissiveMap', 'metalnessMap', 'roughnessMap', 'alphaMap'].forEach((k) => m[k]?.dispose());
        m.dispose();
      });
    };
  }, [rig, gl, onReady]);

  useFrame(() => {
    const d = director;
    // Exploded view: cada capa avanza por su propio parámetro e1…e7.
    const amount = { glass: d.e1, body: d.e2, aero: d.e3, wheels: d.e4, interior: d.e5, chassis: d.e6, mech: d.e7 };
    for (const m of rig.movers) {
      const k = amount[m.layer];
      m.obj.position.copy(m.base).addScaledVector(m.offset, k);
    }
    // Alerón: sube unos centímetros; los cuellos de cisne se estiran desde su base.
    if (rig.wing) {
      const lift = MOTION.wing.lift * d.wingLift;
      rig.wing.obj.position.y += lift;
      for (const l of rig.wing.legs) l.pivot.scale.y = (l.h + lift) / l.h;
      if (rig.wing.flapPivot) {
        qx.setFromAxisAngle(X, THREE.MathUtils.degToRad(MOTION.wing.flapDeg * d.flap));
        rig.wing.flapPivot.quaternion.copy(rig.wing.flapBase).multiply(qx);
      }
    }
    // Ruedas: llanta + neumático + disco giran; la pinza (hija de la esquina) queda fija.
    for (const c of rig.corners) {
      c.spin.rotation.x = d.spin;
      c.outer.position.x = (c.id === 'FL' ? MOTION.wheel.slide * d.wheelOut : 0) * c.side;
    }
    if (rig.doorGlassL) rig.doorGlassL.visible = d.glassL > 0.5;
    for (const e of emissives) e.mat.emissiveIntensity = e.base * (e.interior ? 0.4 + d.interior : d.head * intro.head);
    setXray(xrayMats, d.xray, xrayState.current);
  }, -1);

  return (
    <>
      <primitive object={rig.car} />
      <Projector rig={rig} />
    </>
  );
}
