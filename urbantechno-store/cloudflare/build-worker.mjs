// Empaqueta dist/ dentro de un Worker de Cloudflare (sitio estático sin subida de assets).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const OUT = new URL('./worker.js', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
};
const TEXT = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = {};
for (const p of walk(DIST)) {
  const ext = extname(p);
  const key = '/' + relative(DIST, p).split('\\').join('/');
  const buf = readFileSync(p);
  files[key] = TEXT.has(ext) ? [TYPES[ext] || 'text/plain', 0, buf.toString('utf8')] : [TYPES[ext] || 'application/octet-stream', 1, buf.toString('base64')];
}

const src = `const FILES = ${JSON.stringify(files)};
const cache = new Map();
const body = (f) => { if (!f[1]) return f[2]; if (!cache.has(f[2])) cache.set(f[2], Uint8Array.from(atob(f[2]), (c) => c.charCodeAt(0))); return cache.get(f[2]); };
const respond = (f, status = 200, path = '') => new Response(body(f), { status, headers: {
  'content-type': f[0],
  'cache-control': path.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
  'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin',
} });
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.hostname === 'www.urbantecstore.com') { url.hostname = 'urbantecstore.com'; return Response.redirect(url.toString(), 308); }
    let p = decodeURIComponent(url.pathname);
    if (FILES[p]) return respond(FILES[p], 200, p);
    if (p.endsWith('/') && FILES[p + 'index.html']) return respond(FILES[p + 'index.html'], 200, p);
    if (!p.endsWith('/') && FILES[p + '/index.html']) { url.pathname = p + '/'; return Response.redirect(url.toString(), 308); }
    return respond(FILES['/404.html'], 404, p);
  },
};
`;
writeFileSync(OUT, src);
console.log(Object.keys(files).length, 'archivos,', (src.length / 1024 / 1024).toFixed(2), 'MB');
