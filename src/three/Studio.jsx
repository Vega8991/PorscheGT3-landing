/**
 * Estudio fotográfico: entorno de softboxes generado por código (sin HDR externo),
 * luz principal orbitable (luz lateral del plano final), contraluces para la silueta,
 * barrido de luz para los macros, luz cálida de cabina, tira de luz del hero y suelo.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { director, intro } from '../scroll/director';

function buildEnvironment(gl) {
  const env = new THREE.Scene();
  env.background = new THREE.Color('#000000');
  const box = (w, h, intensity, pos, look, color = '#ffffff') => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(...look); env.add(m);
  };
  box(7, 1.8, 2.6, [0, 6, 0], [0, 0, 0]);               // softbox cenital: línea larga sobre capó y techo
  box(0.6, 7, 1.6, [6, 2.2, 0], [0, 1, 0]);             // tira lateral izquierda
  box(0.6, 7, 0.9, [-6, 2.2, 0], [0, 1, 0]);            // tira lateral derecha (más débil: modelado)
  box(4, 3, 1.1, [5, 3, 6], [0, 0.8, 0]);               // softbox frontal 3/4
  box(9, 0.35, 3.2, [0, 2.4, -7], [0, 1, 0]);           // contraluz trasero
  box(20, 2, 0.06, [0, -0.5, 0], [0, 3, 0], '#a0a6b0');  // rebote del suelo, muy tenue
  const pmrem = new THREE.PMREMGenerator(gl);
  const tex = pmrem.fromScene(env, 0.02, 0.1, 40).texture;
  env.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  pmrem.dispose();
  return tex;
}

// Suelo sin iluminar: degradado radial pintado (ciclorama). Así ningún foco deja manchas en el suelo.
function floorTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, '#141417'); grd.addColorStop(0.35, '#0b0b0d'); grd.addColorStop(1, '#050506');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shadowTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 64, 4, 32, 64, 62);
  grd.addColorStop(0, 'rgba(0,0,0,0.92)'); grd.addColorStop(0.55, 'rgba(0,0,0,0.6)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function Studio() {
  const { gl, scene } = useThree();
  const key = useRef(), rimL = useRef(), rimR = useRef(), sweep = useRef(), cabin = useRef(), strip = useRef();
  const stripMat = useRef();
  const floorMat = useRef();

  const envTex = useMemo(() => buildEnvironment(gl), [gl]);
  const shadow = useMemo(() => shadowTexture(), []);
  const floor = useMemo(() => floorTexture(), []);

  useEffect(() => {
    scene.environment = envTex;
    scene.background = new THREE.Color('#050506');
    return () => { scene.environment = null; envTex.dispose(); shadow.dispose(); floor.dispose(); };
  }, [scene, envTex, shadow, floor]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const d = director;
    scene.environmentIntensity = d.env * intro.env;
    // Luz principal en órbita (keyAz/keyEl): de estudio 3/4 a luz lateral rasante en el plano final.
    const az = THREE.MathUtils.degToRad(d.keyAz), el = THREE.MathUtils.degToRad(d.keyEl);
    key.current.position.set(Math.sin(az) * Math.cos(el) * 8, Math.sin(el) * 8 + 0.4, Math.cos(az) * Math.cos(el) * 8);
    key.current.intensity = 2.2 * d.key * intro.key;
    const rim = 30 * d.rim * intro.rim;
    rimL.current.intensity = rim; rimR.current.intensity = rim;
    rimL.current.target.position.set(0.4, 0.9, 0.6); rimR.current.target.position.set(-0.4, 0.9, 0.6);
    rimL.current.target.updateMatrixWorld(); rimR.current.target.updateMatrixWorld();
    // Barrido de luz para macros: recorre el objetivo de cámara de lado a lado.
    sweep.current.intensity = 26 * d.sweepI;
    tmp.set(d.tx, d.ty, d.tz);
    sweep.current.position.set(d.tx + d.sweep * 1.6, d.ty + 1.1, d.tz + 0.9 * Math.sign(d.tz || 1));
    sweep.current.target.position.copy(tmp); sweep.current.target.updateMatrixWorld();
    cabin.current.intensity = 1.6 * d.interior;
    // El suelo sigue a la luz de la escena (negro en la intro, apagado con dim).
    floorMat.current.color.setScalar(Math.min(1, d.env * intro.env + 0.15 * intro.rim) * (1 - d.dim));
    // Tira de luz del hero: la "línea de luz" que se convierte en la fuente que revela el coche.
    // La tira se coloca siempre perpendicular a la cámara, detrás del coche y a la altura del techo.
    const caz = THREE.MathUtils.degToRad(d.az);
    strip.current.rotation.y = caz;
    strip.current.position.set(-Math.sin(caz) * 6.5, 1.05, -Math.cos(caz) * 6.5);
    strip.current.scale.x = Math.max(0.0001, intro.stripW);
    stripMat.current.color.setScalar(4 * intro.strip * d.strip);
    strip.current.visible = intro.strip * d.strip > 0.001;
  });

  return (
    <>
      <directionalLight ref={key} color="#fff6ec" />
      <spotLight ref={rimL} position={[-3.2, 3.4, -5.5]} angle={0.32} penumbra={1} decay={1.2} distance={14} color="#e8eefc" />
      <spotLight ref={rimR} position={[3.2, 3.4, -5.5]} angle={0.32} penumbra={1} decay={1.2} distance={14} color="#e8eefc" />
      <spotLight ref={sweep} angle={0.35} penumbra={0.9} decay={1.5} distance={8} color="#ffffff" />
      <pointLight ref={cabin} position={[0.15, 1.12, 0.05]} distance={1.6} decay={1.4} color="#ffd9b0" />
      <mesh ref={strip}>
        <boxGeometry args={[9, 0.02, 0.02]} />
        <meshBasicMaterial ref={stripMat} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshBasicMaterial ref={floorMat} map={floor} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.003, -0.07]}>
        <planeGeometry args={[2.5, 5.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </>
  );
}
