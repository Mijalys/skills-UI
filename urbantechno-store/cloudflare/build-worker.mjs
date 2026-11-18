// Empaqueta dist/ en site-files.js para el Worker (worker.js) y calcula las huellas
// de los scripts en línea para la política de seguridad de contenido.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = new URL('../dist/', import.meta.url).pathname;
const OUT = new URL('./site-files.js', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
};
const TEXT = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = {};
const hashes = new Set();
for (const p of walk(DIST)) {
  const ext = extname(p);
  const key = '/' + relative(DIST, p).split('\\').join('/');
  const buf = readFileSync(p);
  if (ext === '.html') for (const m of buf.toString('utf8').matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)) hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  files[key] = TEXT.has(ext) ? [TYPES[ext] || 'text/plain', 0, buf.toString('utf8')] : [TYPES[ext] || 'application/octet-stream', 1, buf.toString('base64')];
}

const src = `export const FILES = ${JSON.stringify(files)};\nexport const SCRIPT_HASHES = ${JSON.stringify([...hashes])};\n`;
writeFileSync(OUT, src);
console.log(Object.keys(files).length, 'archivos,', (src.length / 1024 / 1024).toFixed(2), 'MB,', hashes.size, 'scripts en línea');
