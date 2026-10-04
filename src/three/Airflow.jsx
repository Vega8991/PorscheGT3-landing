/**
 * Líneas de flujo: tubos finos generados a partir del perfil real del modelo (scripts/build_airflow.py).
 * Un único ShaderMaterial: el trazo se "dibuja" de morro a cola (uReveal) y unos pulsos recorren
 * la línea (uTime · uSpeed). Representación cinematográfica, no simulación.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import data from '../data/airflow.json';
import { director, frame } from '../scroll/director';
import { GROUND } from './rig';

const vertex = /* glsl */ `
  varying float vU;
  varying float vSeed;
  attribute float seed;
  void main() {
    vU = uv.x;
    vSeed = seed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragment = /* glsl */ `
  uniform float uTime, uReveal, uOpacity, uSpeed;
  uniform vec3 uColor;
  varying float vU;
  varying float vSeed;
  void main() {
    float head = uReveal * 1.08;
    float drawn = smoothstep(head, head - 0.05, vU);
    float tip = exp(-pow((vU - head + 0.02) * 40.0, 2.0)) * step(uReveal, 0.999);
    float pulse = pow(fract(vU * 5.0 - uTime * 0.22 * uSpeed + vSeed), 7.0);
    float ends = smoothstep(0.0, 0.06, vU) * smoothstep(1.0, 0.86, vU);
    float a = (0.16 + pulse * 0.75) * drawn * ends + tip * 0.9;
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;

export function Airflow({ tier }) {
  const lines = useMemo(() => data.lines.filter((l) => tier === 'full' || l.tier === 'all'), [tier]);
  const group = useRef();
  const radius = tier === 'full' ? 0.0042 : 0.0065;

  const { geometries, material } = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex, fragmentShader: fragment,
      uniforms: { uTime: { value: 0 }, uReveal: { value: 0 }, uOpacity: { value: 0 }, uSpeed: { value: 1 }, uColor: { value: new THREE.Color('#dfe6ee') } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const geometries = lines.map((l, i) => {
      const curve = new THREE.CatmullRomCurve3(l.points.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal');
      const g = new THREE.TubeGeometry(curve, 240, radius, 4, false);
      const seed = new Float32Array(g.attributes.position.count).fill((i * 0.37) % 1);
      g.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
      return g;
    });
    return { geometries, material };
  }, [lines, radius]);

  useEffect(() => () => { geometries.forEach((g) => g.dispose()); material.dispose(); }, [geometries, material]);

  useFrame((_, delta) => {
    const u = material.uniforms;
    const animate = tier !== 'static';
    u.uOpacity.value = director.airO;
    u.uReveal.value = animate ? director.air : director.airO > 0 ? 1 : 0;
    u.uSpeed.value = director.airSpeed;
    if (animate && director.airO > 0.01) u.uTime.value += Math.min(delta, 0.05);
    frame.flowing = animate && director.airO > 0.01;
    group.current.visible = director.airO > 0.001;
  });

  return (
    <group ref={group} position={[0, GROUND, 0]}>
      {geometries.map((g, i) => <mesh key={i} geometry={g} material={material} frustumCulled={false} renderOrder={5} />)}
    </group>
  );
}
