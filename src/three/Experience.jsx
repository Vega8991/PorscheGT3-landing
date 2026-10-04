/**
 * Escena 3D completa. Se importa de forma diferida (chunk "three") tras el primer pintado.
 * frameloop="demand": solo se renderiza cuando el director cambia, la intro corre o el flujo de aire es visible.
 */
import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { CarModel } from './CarModel';
import { CameraRig } from './CameraRig';
import { Studio } from './Studio';
import { Airflow } from './Airflow';
import { director, intro, frame, DEFAULTS } from '../scroll/director';

// Solo claves propias: GSAP añade `_gsap` a los objetos que anima.
const DIR_KEYS = Object.keys(DEFAULTS);
const INTRO_KEYS = ['strip', 'stripW', 'rim', 'env', 'key', 'head'];
import { MOTION } from '../motion/motion.config';

function Invalidator() {
  const { invalidate, gl } = useThree();
  const last = useRef('');
  useEffect(() => {
    const tick = () => {
      let sig = 0, i = 1;
      for (const k of DIR_KEYS) sig += director[k] * (i++ * 0.618);
      for (const k of INTRO_KEYS) sig += intro[k] * (i++ * 0.618);
      const s = sig.toFixed(5);
      const dark = director.dim >= 0.999;
      if ((s !== last.current || (frame.flowing && !dark)) || frame.dirty) {
        last.current = s; frame.dirty = false;
        invalidate();
      }
    };
    gsap.ticker.add(tick);
    if (new URLSearchParams(location.search).has('debug')) window.__kick = () => { frame.dirty = true; };
    const onResize = () => { frame.dirty = true; };
    window.addEventListener('resize', onResize);
    return () => { gsap.ticker.remove(tick); window.removeEventListener('resize', onResize); };
  }, [invalidate, gl]);
  return null;
}

function Exposure() {
  useFrame(({ gl }) => {
    gl.toneMappingExposure = director.exposure * (1 - director.dim);
    window.__frames = (window.__frames || 0) + 1;
  }, -3);
  return null;
}

export default function Experience({ tier, onReady, onFirstFrame }) {
  const firstFrame = useRef(false);
  return (
    <Canvas
      frameloop="demand"
      dpr={tier === 'full' ? MOTION.dpr.full : MOTION.dpr.lite}
      camera={{ fov: 28, near: 0.02, far: 120, position: [6, 1, 6] }}
      gl={{ antialias: tier === 'full', powerPreference: 'high-performance', alpha: false, stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setClearColor('#050506');
        if (new URLSearchParams(location.search).has('debug')) window.__gl = gl;
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <Exposure />
      <CameraRig />
      <Studio />
      <Suspense fallback={null}>
        <CarModel onReady={onReady} />
        <Airflow tier={tier} />
        <FirstFrame onFirstFrame={() => { if (!firstFrame.current) { firstFrame.current = true; onFirstFrame?.(); } }} />
      </Suspense>
      <Invalidator />
    </Canvas>
  );
}

function FirstFrame({ onFirstFrame }) {
  const done = useRef(false);
  useFrame(() => { if (!done.current) { done.current = true; requestAnimationFrame(onFirstFrame); } });
  return null;
}
