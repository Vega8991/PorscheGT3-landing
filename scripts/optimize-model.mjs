/**
 * Optimiza una COPIA del GLB conservando la jerarquía de objetos animables.
 *
 * Qué hace:
 *  - Elimina variantes duplicadas que se renderizan superpuestas (z-fighting) y piezas
 *    que no existen en el 992 GT3 RS de serie (asientos traseros, palanca/embrague manual).
 *  - prune + dedup (texturas duplicadas: 13 → 8 imágenes).
 *  - Simplificación con error muy bajo (afecta sobre todo a neumáticos y tapicería).
 *  - Meshopt (cuantización + compresión) y texturas WebP ≤ 1024 px.
 *
 * Qué NO hace (a propósito): join, flatten, instance. Esos pasos colapsan la escena
 * a ~23 nodos y destruyen la posibilidad de animar piezas individuales.
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, weld, simplify, meshopt, textureCompress, quantize, reorder } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'public/models/GT3RS.source.glb';
const OUT = 'public/models/GT3RS.glb';

// Variantes superpuestas y piezas ajenas al GT3 RS (ver informe técnico del modelo).
const REMOVE = [
  'TwiXeR_992_exhausttip_3_chrome',      // duplicada con _antichrome
  'TwiXeR_992_door_L_chrome_end',        // duplicada con _antichrome_end
  'TwiXeR_992_door_R_chrome_end',
  'TwiXeR_992_chrome_dash_accessories',  // duplicada con black_dash_accessories
  'TwiXeR_992_needle_tacho',             // duplicada con needle_tacho_9000
  'TwiXeR_992_dash_noclock',             // alternativa de dash_clock
  'TwiXeR_992_shifter_base_M',           // el GT3 RS 992 solo se vende con PDK
  'TwiXeR_992_shifter_boot_M',
  'TwiXeR_992_shifter_knob_M',
  'TwiXeR_992_clutchpedal',
  'TwiXeR_992_seats_R',                  // el GT3 RS no tiene plazas traseras
];

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

const doc = await io.read(SRC);
const root = doc.getRoot();
const before = root.listNodes().length;

for (const node of root.listNodes()) {
  if (REMOVE.includes(node.getName())) {
    node.traverse((n) => n.dispose());
  }
}

await doc.transform(
  prune({ keepAttributes: false, keepLeaves: false }),
  dedup(),
  weld(),
);

// Simplificación con error muy bajo (0,08 % del tamaño del modelo): solo ceden triángulos
// las mallas densas y suaves (neumáticos, tapicería, volante); siluetas y aristas se conservan.
await doc.transform(
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.0008, lockBorder: true }),
);

await doc.transform(
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 88 }),
  reorder({ encoder: MeshoptEncoder }),
  quantize({ quantizationVolume: 'scene' }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  prune(),
);

await io.write(OUT, doc);

const after = root.listNodes().length;
const tris = root.listMeshes().reduce((t, m) => t + m.listPrimitives().reduce((a, p) => {
  const idx = p.getIndices();
  return a + (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3;
}, 0), 0);
console.log(JSON.stringify({
  src: (fs.statSync(SRC).size / 1e6).toFixed(2) + ' MB',
  out: (fs.statSync(OUT).size / 1e6).toFixed(2) + ' MB',
  nodesBefore: before, nodesAfter: after,
  meshes: root.listMeshes().length, materials: root.listMaterials().length,
  textures: root.listTextures().length, triangles: Math.round(tris),
}, null, 2));
