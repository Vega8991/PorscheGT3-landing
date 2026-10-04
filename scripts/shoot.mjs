// Captura de comprobación: recorre la película y guarda un fotograma por escena.
// Uso: SHOTS='[["form",0.3]]' node scripts/shoot.mjs <url> <w> <h> <outdir>
import { chromium } from 'playwright';
const [, , url = 'http://localhost:4173/?tier=full&debug&noscrub&nolag&skipintro', w = '1280', h = '720', out = '/tmp/claude-0/shots'] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const logs = [];
p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => logs.push('PAGEERROR ' + e.message));
p.setDefaultTimeout(180000);
await p.goto(url, { waitUntil: 'load' });
const has3D = await p.waitForFunction(() => document.querySelector('.stage.is-live') && window.__master, null, { timeout: 90000 }).then(() => true).catch(() => false);
if (has3D) await p.waitForFunction(() => window.__intro?.done, null, { timeout: 120000 }).catch(() => logs.push('intro not done'));
else await p.waitForTimeout(3000);
const T0 = Date.now();
console.log("ready");
const frames = () => p.evaluate(() => window.__frames || 0);
const shots = JSON.parse(process.env.SHOTS || '[["hero",0]]');
for (const [id, t] of shots) {
  await p.evaluate(([id, t]) => {
    const r = window.__master.ranges[id];
    window.scrollTo({ top: r.start + t * (r.end - r.start), behavior: 'instant' });
    window.__ST.update();
  }, [id, t]);
  if (has3D) { const f0 = await frames(); for (let k = 0; k < 2; k++) { await p.evaluate(() => window.__kick?.()); await p.waitForFunction((f0) => (window.__frames || 0) > f0, await frames(), { timeout: +(process.env.FWAIT || 20000) }).catch(() => {}); } }
  await p.waitForTimeout(+(process.env.WAIT || 400));
  console.log("shot", id, t, ((Date.now() - T0) / 1000).toFixed(0) + "s");
  await p.screenshot({ path: `${out}/${w}_${id}_${String(t).replace('.', '')}.png` });
}
const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
console.log(JSON.stringify({ overflowX: ov, has3D, logs: logs.slice(0, 20) }));
await b.close();
