// Worker de urbantecstore.com: sirve el sitio estático (site-files.js, generado) y el
// Libro de Reclamaciones virtual, que guarda cada hoja con número correlativo.
import { FILES, SCRIPT_HASHES } from './site-files.js';

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${SCRIPT_HASHES.join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self' https://wa.me",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

const SECURITY = {
  'content-security-policy': CSP,
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

const decoded = new Map();
const body = (f) => {
  if (!f[1]) return f[2];
  if (!decoded.has(f[2])) decoded.set(f[2], Uint8Array.from(atob(f[2]), (c) => c.charCodeAt(0)));
  return decoded.get(f[2]);
};
const serve = (f, status, path) => new Response(body(f), { status, headers: {
  'content-type': f[0],
  'cache-control': path.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
  ...SECURITY,
} });
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: {
  'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...SECURITY,
} });

// Campos de la hoja: [nombre, obligatorio, largo máximo]
const FIELDS = [
  ['nombre', 1, 120], ['documento', 1, 20], ['telefono', 1, 30], ['correo', 0, 120], ['domicilio', 1, 200],
  ['menor', 0, 5], ['apoderado', 0, 120],
  ['tipoBien', 1, 20], ['monto', 0, 20], ['producto', 1, 300],
  ['clase', 1, 10], ['detalle', 1, 3000], ['pedido', 1, 1500],
];

function validate(input) {
  const out = {};
  for (const [k, req, max] of FIELDS) {
    const v = String(input?.[k] ?? '').trim();
    if (req && !v) return { error: `Falta el campo: ${k}` };
    if (v.length > max) return { error: `El campo ${k} es demasiado largo` };
    out[k] = v;
  }
  if (!['Reclamo', 'Queja'].includes(out.clase)) return { error: 'Tipo inválido' };
  if (!['Producto', 'Servicio'].includes(out.tipoBien)) return { error: 'Tipo de bien inválido' };
  if (out.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.correo)) return { error: 'Correo inválido' };
  if (out.menor === 'si' && !out.apoderado) return { error: 'Indica el nombre del padre, madre o apoderado' };
  if (input?.acepta !== true) return { error: 'Debes aceptar la declaración' };
  return { data: out };
}

const timingSafeEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

async function api(req, env, url) {
  const stub = env.LIBRO.get(env.LIBRO.idFromName('libro-principal'));
  if (req.method === 'POST') {
    const len = Number(req.headers.get('content-length') || 0);
    if (len > 16384) return json({ error: 'Solicitud demasiado grande' }, 413);
    let input; try { input = await req.json(); } catch { return json({ error: 'Formato inválido' }, 400); }
    if (input?.web) return json({ error: 'Rechazado' }, 400); // campo trampa para bots
    const { data, error } = validate(input);
    if (error) return json({ error }, 400);
    const ip = req.headers.get('cf-connecting-ip') || '';
    return stub.fetch('https://libro/registrar', { method: 'POST', body: JSON.stringify({ data, ip }) });
  }
  if (req.method === 'GET') {
    const key = url.searchParams.get('clave') || '';
    if (!env.ADMIN_KEY || !timingSafeEqual(key, env.ADMIN_KEY)) return json({ error: 'No autorizado' }, 401);
    return stub.fetch('https://libro/listar?formato=' + (url.searchParams.get('formato') || 'csv'));
  }
  return json({ error: 'Método no permitido' }, 405);
}

export class LibroReclamaciones {
  constructor(ctx) { this.ctx = ctx; }
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/registrar') {
      const { data, ip } = await req.json();
      // Límite simple: 5 hojas por IP por hora.
      const hour = Math.floor(Date.now() / 3600000);
      const rlKey = `rl:${hour}:${ip}`;
      const count = (await this.ctx.storage.get(rlKey)) || 0;
      if (ip && count >= 5) return json({ error: 'Demasiadas solicitudes. Intenta más tarde o escríbenos por WhatsApp.' }, 429);
      const seq = ((await this.ctx.storage.get('seq')) || 0) + 1;
      const now = new Date();
      const year = new Intl.DateTimeFormat('en', { timeZone: 'America/Lima', year: 'numeric' }).format(now);
      const codigo = `LR-${year}-${String(seq).padStart(6, '0')}`;
      const fecha = now.toISOString();
      await this.ctx.storage.put({ seq, [`hoja:${String(seq).padStart(9, '0')}`]: { codigo, fecha, ...data }, ...(ip ? { [rlKey]: count + 1 } : {}) });
      return json({ codigo, fecha });
    }
    if (url.pathname === '/listar') {
      const rows = [...(await this.ctx.storage.list({ prefix: 'hoja:' })).values()];
      if (url.searchParams.get('formato') === 'json') return json(rows);
      const cols = ['codigo', 'fecha', ...FIELDS.map((f) => f[0])];
      const q = (v) => { v = String(v ?? ''); return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
      const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => q(r[c])).join(','))].join('\n');
      return new Response('﻿' + csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="libro-de-reclamaciones.csv"', 'cache-control': 'no-store' } });
    }
    return json({ error: 'No encontrado' }, 404);
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.hostname === 'www.urbantecstore.com') { url.hostname = 'urbantecstore.com'; return Response.redirect(url.toString(), 308); }
    if (url.pathname === '/api/reclamos') return api(req, env, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return json({ error: 'Método no permitido' }, 405);
    let p; try { p = decodeURIComponent(url.pathname); } catch { p = url.pathname; }
    if (FILES[p]) return serve(FILES[p], 200, p);
    if (p.endsWith('/') && FILES[p + 'index.html']) return serve(FILES[p + 'index.html'], 200, p);
    if (!p.endsWith('/') && FILES[p + '/index.html']) { url.pathname = p + '/'; return Response.redirect(url.toString(), 308); }
    return serve(FILES['/404.html'], 404, p);
  },
};
