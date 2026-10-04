/**
 * Corrección de materiales del export de Sketchfab.
 * Problema detectado en el análisis: muchos materiales no declaran metallicFactor (→ 1.0 por defecto)
 * y tienen roughness 0, así que los plásticos negros se ven como espejo. Aquí se reasignan por familia.
 * Además: rayos X por fresnel inyectado en los materiales de cristal, carrocería e interior
 * (un solo draw call por malla, sin duplicar geometría).
 */
import * as THREE from 'three';

export const xrayUniform = { value: 0 };
export const emissives = []; // { mat, base }

const has = (name, ...keys) => keys.some((k) => name.includes(k));

function tune(src) {
  const n = src.name || '';
  let m;

  if (has(n, 'carPaint.003')) {
    m = new THREE.MeshPhysicalMaterial({
      name: n, color: new THREE.Color('#d6d6d2'), metalness: 0.0, roughness: 0.26,
      clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.1,
    });
  } else if (has(n, 'carbon_roof')) {
    m = new THREE.MeshPhysicalMaterial({
      name: n, map: src.map, color: new THREE.Color('#bdbdbd'), metalness: 0.25, roughness: 0.38,
      clearcoat: 1, clearcoatRoughness: 0.08,
    });
    if (m.map) { m.map.anisotropy = 8; m.map.repeat.set(1, 1); }
  } else if (has(n, 'glass', 'blackGlass', 'antichrome.002')) {
    m = src.clone();
    m.metalness = 0; m.roughness = 0.04;
    if (has(n, 'blackGlass')) { m.color.set('#050506'); m.transparent = false; m.opacity = 1; }
    else { m.color.set('#0c0d10'); m.transparent = true; m.opacity = Math.min(0.55, Math.max(0.25, src.opacity)); m.depthWrite = false; }
    m.envMapIntensity = 1.6;
  } else if (has(n, 'Scene_-_Root')) { // neumáticos
    m = new THREE.MeshStandardMaterial({ name: n, color: '#121214', metalness: 0, roughness: 0.82 });
  } else if (has(n, 'amdb11_brake')) { // disco
    m = new THREE.MeshStandardMaterial({ name: n, color: '#8a8b8e', metalness: 1, roughness: 0.34 });
  } else if (has(n, 'amdb11_caliper')) {
    m = new THREE.MeshPhysicalMaterial({ name: n, color: '#b3000e', metalness: 0.1, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.1 });
  } else if (has(n, 'amdb11_misc')) {
    m = new THREE.MeshStandardMaterial({ name: n, color: '#3a3b3e', metalness: 0.9, roughness: 0.4 });
  } else if (has(n, 'wheels_chrome')) {
    m = new THREE.MeshStandardMaterial({ name: n, color: '#2a2b2e', metalness: 1, roughness: 0.32 });
  } else if (has(n, 'GT3RS_black')) {
    m = new THREE.MeshStandardMaterial({ name: n, color: '#1a1a1c', metalness: 0.8, roughness: 0.3 });
  } else if (has(n, 'chrome', 'exhausttip')) {
    // titanio / cromados interiores: metal satinado, no espejo
    m = src.clone(); m.color.set(has(n, 'exhausttip') ? '#5d5f63' : '#9a9ca0'); m.metalness = 1; m.roughness = 0.28;
  } else if (has(n, 'led_lights', 'headlight_high')) {
    m = src.clone(); m.metalness = 0; m.roughness = 0.2; m.emissive = new THREE.Color('#ffffff');
    emissives.push({ mat: m, base: 2.2 });
  } else if (has(n, 'taillight_running', 'brakelight')) {
    m = src.clone(); m.metalness = 0; m.roughness = 0.25; m.color.set('#3a0004'); m.emissive = new THREE.Color('#ff1020');
    emissives.push({ mat: m, base: 0.9 });
  } else if (has(n, 'headlight')) {
    m = src.clone(); m.metalness = 0.6; m.roughness = 0.25;
  } else if (has(n, 'metal_radiator')) { // rejillas (máscara alfa)
    m = src.clone(); m.metalness = 0.3; m.roughness = 0.55; m.alphaTest = 0.4; m.transparent = false;
  } else if (has(n, 'gauges_1', 'gps_screen')) { // pantallas TFT apagadas: negro brillante, no lavanda
    m = src.clone(); m.color.set('#060608'); m.metalness = 0; m.roughness = 0.12;
  } else if (has(n, 'gauges', 'symbols', 'dash_clock')) {
    m = src.clone(); m.metalness = 0; m.roughness = Math.max(0.35, m.roughness);
    if (m.map) { m.emissive = new THREE.Color('#ffffff'); m.emissiveMap = m.map; emissives.push({ mat: m, base: 0.35, interior: true }); }
  } else if (has(n, 'leather', 'fabric', 'carpet', 'stitch', 'seatbelt', 'speakers', 'Interior_D', 'rivet')) {
    m = src.clone(); m.metalness = 0; m.roughness = Math.max(0.7, m.roughness || 0.8);
  } else if (has(n, 'carPaint.008', 'undercarriage', 'engine', 'TwiXeR_992.001')) {
    m = src.clone(); m.metalness = 0.2; m.roughness = 0.7;
  } else {
    // plásticos, gomas, anti-cromados y resto: dieléctricos satinados
    m = src.clone(); m.metalness = 0; m.roughness = THREE.MathUtils.clamp(src.roughness || 0.5, 0.4, 0.75);
  }
  m.side = src.side;
  return m;
}

function injectXray(mat) {
  mat.userData.xray = true;
  mat.userData.baseTransparent = mat.transparent;
  mat.userData.baseDepthWrite = mat.depthWrite;
  mat.userData.baseOpacity = mat.opacity;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uXray = xrayUniform;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uXray;')
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        if (uXray > 0.0) {
          float fres = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.2);
          vec3 xr = vec3(0.78, 0.84, 0.9) * (0.15 + fres * 1.35);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, xr, uXray);
          gl_FragColor.a = mix(gl_FragColor.a, 0.02 + fres * 0.55, uXray);
        }`);
  };
  mat.customProgramCacheKey = () => 'xray';
}

/** Aplica materiales corregidos. Devuelve la lista de materiales con rayos X. */
export function applyMaterials(rig) {
  const cache = new Map();
  const xrayMats = new Set();
  const xrayLayers = new Set(['glass', 'body', 'interior']);
  const layerOfObj = new Map();
  for (const m of rig.movers) layerOfObj.set(m.obj, m.layer);

  rig.car.traverse((o) => {
    if (!o.isMesh) return;
    let p = o, layer = null;
    while (p && !layer) { layer = layerOfObj.get(p); p = p.parent; }
    const xray = xrayLayers.has(layer);
    const key = `${o.material.uuid}:${xray}`;
    if (!cache.has(key)) {
      const m = tune(o.material);
      if (xray) { injectXray(m); xrayMats.add(m); }
      cache.set(key, m);
    }
    o.material = cache.get(key);
    o.frustumCulled = true;
  });
  return [...xrayMats];
}

/** Activa/desactiva la transparencia solo al cruzar el umbral (evita recompilar cada fotograma). */
export function setXray(mats, amount, state) {
  xrayUniform.value = amount;
  const on = amount > 0.001;
  if (state.on === on) return;
  state.on = on;
  for (const m of mats) {
    m.transparent = on ? true : m.userData.baseTransparent;
    m.depthWrite = on ? false : m.userData.baseDepthWrite;
    m.needsUpdate = true;
  }
}
