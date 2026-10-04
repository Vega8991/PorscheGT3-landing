// Auditoría: sin JS, encabezados, overflow en 6 anchos, teclado, errores de hidratación.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const out = {};
{ // Sin JavaScript
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage(); await p.goto('http://localhost:4173/');
  out.noJs = await p.evaluate(() => ({ h1: document.querySelectorAll('h1').length, h2: [...document.querySelectorAll('h2')].map((h) => h.textContent.trim()).slice(0, 20), textLen: document.body.innerText.length, figures: [...document.querySelectorAll('.figure-xl__value')].map((e) => e.textContent) }));
  await p.screenshot({ path: '/tmp/claude-0/shots/nojs.png', fullPage: false });
  await ctx.close();
}
for (const w of [375, 390, 768, 1280, 1440, 1920]) { // overflow con JS, tier estático (sin coste WebGL)
  const p = await b.newPage({ viewport: { width: w, height: w < 800 ? 812 : 900 } });
  const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160))); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:4173/?tier=static-lite'); await p.waitForTimeout(1500);
  const res = [];
  for (const f of [0, 0.15, 0.35, 0.55, 0.75, 0.95]) {
    await p.evaluate((f) => window.scrollTo(0, f * (document.documentElement.scrollHeight - innerHeight)), f); await p.waitForTimeout(250);
    res.push(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  out['w' + w] = { overflow: Math.max(...res), errors: errs.slice(0, 5) };
  await p.close();
}
{ // Teclado
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('http://localhost:4173/?tier=static-lite'); await p.waitForTimeout(1200);
  const seq = [];
  for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return `${a.tagName}:${(a.textContent || '').trim().slice(0, 28)}|outline:${cs.outlineStyle}`; })); }
  out.tab = seq;
  await p.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
