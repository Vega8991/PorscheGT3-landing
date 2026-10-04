import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const file = 'dist/index.html';
const html = fs.readFileSync(file, 'utf8').replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
fs.writeFileSync(file, html);
fs.rmSync('dist-ssr', { recursive: true, force: true });
console.log('prerendered', (Buffer.byteLength(html) / 1024).toFixed(1), 'KB');
