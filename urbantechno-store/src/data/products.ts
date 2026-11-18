import catalogoCsv from './catalogo.csv?raw';

export type Condition = 'nuevo' | 'seminuevo';
export type Grade = 'A' | 'B';

export interface Category {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
  warranty: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  condition: Condition;
  grade?: Grade;
  price: number;
  oldPrice?: number;
  image: string;
  alt: string;
  short: string;
  specs: string[];
  includes: string[];
  sizes?: string[];
  stock: number;
  featured?: boolean;
  /** true cuando la foto es de stock (Unsplash) y no del producto real */
  stockPhoto: boolean;
}

export const categories: Category[] = [
  {
    slug: 'celulares',
    name: 'Celulares',
    short: 'iPhone y Samsung',
    description: 'iPhone y Samsung nuevos sellados o seminuevos certificados, liberados para cualquier operador en Perú.',
    image: '1592750475338-74b7b21085ab',
    warranty: 'Garantía escrita de 6 meses',
  },
  {
    slug: 'laptops',
    name: 'Laptops',
    short: 'MacBook y ultrabooks',
    description: 'MacBook y laptops de trabajo verificadas técnicamente. Batería, teclado y pantalla revisados antes de publicar.',
    image: '1496181133206-80ce9b88a853',
    warranty: 'Garantía escrita de 6 meses',
  },
  {
    slug: 'consolas',
    name: 'Consolas',
    short: 'PlayStation y Xbox',
    description: 'PlayStation y Xbox con mandos originales. Nuevas selladas o seminuevas con lector y puertos probados.',
    image: '1606144042614-b2417e99c4e3',
    warranty: 'Garantía escrita de 6 meses',
  },
  {
    slug: 'zapatillas',
    name: 'Zapatillas',
    short: 'Nike, Jordan, Vans',
    description: 'Zapatillas originales con caja y etiquetas. Cambio de talla en 7 días si no las has usado.',
    image: '1542291026-7eec264c27ff',
    warranty: 'Autenticidad 100 % garantizada',
  },
  {
    slug: 'lentes-de-sol',
    name: 'Lentes de sol',
    short: 'Ray-Ban y más',
    description: 'Lentes de sol originales con estuche y certificado del fabricante.',
    image: '1572635196237-14b3f281503f',
    warranty: 'Autenticidad 100 % garantizada',
  },
];

// El catálogo vive en catalogo.csv (se puede abrir y editar en Excel o Google Sheets).
// Listas dentro de una celda se separan con " | ". Una fila con stock 0 se muestra como agotada.
function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v.trim() !== '')) rows.push(row);
  return rows;
}
const list = (v: string) => v.split('|').map((x) => x.trim()).filter(Boolean);

function loadProducts(): Product[] {
  const [head, ...rows] = parseCsv(catalogoCsv);
  const col = (name: string) => { const i = head.indexOf(name); if (i < 0) throw new Error(`catalogo.csv: falta la columna "${name}"`); return i; };
  const C = Object.fromEntries(['slug','nombre','marca','categoria','condicion','grado','precio','precio_anterior','stock','destacado','imagen_unsplash','imagen_alt','resumen','especificaciones','incluye','tallas'].map((n) => [n, col(n)]));
  const seen = new Set<string>();
  return rows.map((r, n) => {
    const line = n + 2; const get = (k: string) => (r[C[k]] ?? '').trim();
    const fail = (m: string) => { throw new Error(`catalogo.csv fila ${line}: ${m}`); };
    const slug = get('slug'); if (!/^[a-z0-9-]+$/.test(slug)) fail(`slug inválido "${slug}"`);
    if (seen.has(slug)) fail(`slug repetido "${slug}"`); seen.add(slug);
    const category = get('categoria'); if (!categories.some((c) => c.slug === category)) fail(`categoría desconocida "${category}"`);
    const condition = get('condicion'); if (condition !== 'nuevo' && condition !== 'seminuevo') fail('condicion debe ser nuevo o seminuevo');
    const grade = get('grado'); if (condition === 'seminuevo' && grade !== 'A' && grade !== 'B') fail('un seminuevo necesita grado A o B');
    const price = Number(get('precio')); if (!(price > 0)) fail('precio inválido');
    const old = get('precio_anterior') ? Number(get('precio_anterior')) : undefined;
    if (old !== undefined && !(old > price)) fail('precio_anterior debe ser mayor que precio (y haberse cobrado de verdad)');
    const stock = Number(get('stock') || '0'); if (!Number.isInteger(stock) || stock < 0) fail('stock inválido');
    const image = get('imagen_unsplash'); if (!image) fail('falta la imagen');
    return {
      slug, name: get('nombre'), brand: get('marca'), category, condition: condition as Condition,
      grade: (grade || undefined) as Grade | undefined, price, oldPrice: old, stock,
      featured: /^(si|sí|x|1|true)$/i.test(get('destacado')),
      image, alt: get('imagen_alt') || get('nombre'), short: get('resumen'),
      specs: list(get('especificaciones')), includes: list(get('incluye')),
      sizes: get('tallas') ? list(get('tallas')) : undefined,
      stockPhoto: !/^(\/|https?:)/.test(image),
    };
  });
}

export const products: Product[] = loadProducts();

// Acepta un ID de Unsplash, una ruta propia (/fotos/x.jpg en public/) o una URL completa.
export const img = (id: string, w = 800, h?: number) =>
  /^(\/|https?:)/.test(id) ? id : `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ''}&q=75&auto=format&fit=crop`;

export const soles = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 0 });

export const categoryOf = (slug: string) => categories.find((c) => c.slug === slug)!;
export const byCategory = (slug: string) => products.filter((p) => p.category === slug);
export const isTech = (slug: string) => ['celulares', 'laptops', 'consolas'].includes(slug);
