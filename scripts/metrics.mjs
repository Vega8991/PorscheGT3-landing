// Métricas reales en este entorno (Chromium headless + GPU por software SwiftShader). No representan un dispositivo real.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const [w, h, tier] of [[1440, 900, 'full'], [390, 844, 'lite']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  let bytes = 0; const big = [];
  p.on('response', async (r) => { try { const l = +(r.headers()['content-length'] || (await r.body()).length); bytes += l; if (l > 100000) big.push([r.url().split('/').pop().slice(0, 40), (l / 1024).toFixed(0) + 'KB']); } catch {} });
  await p.goto(`http://localhost:4173/?tier=${tier}`);
  await p.waitForTimeout(14000);
  const m = await p.evaluate(() => new Promise((res) => {
    const out = { lcp: 0, lcpEl: '', cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { out.lcp = e.startTime; out.lcpEl = (e.element?.className || e.element?.tagName || '') + ''; } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    setTimeout(() => res({ ...out, fcp: fcp?.startTime, dcl: nav.domContentLoadedEventEnd }), 500);
  }));
  console.log(JSON.stringify({ w, tier, lcp: Math.round(m.lcp), lcpEl: m.lcpEl, cls: +m.cls.toFixed(4), fcp: Math.round(m.fcp), dcl: Math.round(m.dcl), transferKB: Math.round(bytes / 1024), big }));
  await p.close();
}
await b.close();
