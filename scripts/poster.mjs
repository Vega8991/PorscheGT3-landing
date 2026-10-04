// Genera el póster estático del hero a partir del propio render (mismo encuadre que la intro terminada).
import { chromium } from 'playwright';
import sharp from 'sharp';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
p.setDefaultTimeout(240000);
await p.goto('http://localhost:4173/?tier=full&debug&noscrub&nolag&skipintro');
await p.waitForFunction(() => document.querySelector('.stage.is-live') && window.__master);
await p.waitForTimeout(1500);
for (let k = 0; k < 3; k++) { await p.evaluate(() => window.__kick?.()); await p.waitForTimeout(3000); }
await p.addStyleTag({ content: 'main,.topbar,.progress,.annotations,footer,.skip{visibility:hidden!important}' });
await p.waitForTimeout(500);
const buf = await p.locator('.stage canvas').screenshot();
await sharp(buf).resize(1600).webp({ quality: 78 }).toFile('public/poster/hero-1600.webp');
await sharp(buf).resize(800).webp({ quality: 76 }).toFile('public/poster/hero-800.webp');
console.log('poster ok');
await b.close();
