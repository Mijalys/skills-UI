# Urbantecstore

Tienda online de urbantecstore.com (Perú): celulares, laptops, consolas, zapatillas y lentes de sol.
Sitio estático en Astro servido por un Worker de Cloudflare, con pedidos por WhatsApp.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run deploy    # compila, empaqueta y publica en Cloudflare (necesita CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID)
```

## Dónde se edita cada cosa

- **Datos de la tienda** (WhatsApp, correo, RUC, razón social, dirección, redes): `src/site.config.mjs`.
  Lo que está vacío no se muestra en la web.
- **Catálogo**: `src/data/catalogo.csv`. Se abre en Excel o Google Sheets. Una fila por producto.
  - `categoria`: celulares, laptops, consolas, zapatillas o lentes-de-sol.
  - `condicion`: nuevo o seminuevo. Un seminuevo necesita `grado` A o B.
  - `precio_anterior`: solo si de verdad se cobró ese precio antes. Si no, déjalo vacío.
  - `stock`: con 0 el producto se muestra como agotado.
  - `imagen_unsplash`: un ID de Unsplash (se muestra como "Foto referencial") o una foto propia
    guardada en `public/fotos/` y escrita como `/fotos/nombre.jpg`.
  - Listas dentro de una celda (especificaciones, incluye, tallas) se separan con ` | `.
  - Si una fila tiene un error, la compilación se detiene e indica la fila.
- **Preguntas frecuentes**: `src/data/faq.ts`.
- **Paleta y tipografía**: `src/styles/global.css`.

## Libro de Reclamaciones

Cada hoja se guarda en un Durable Object de Cloudflare con un número correlativo (LR-AAAA-000001).
El cliente ve su hoja completa, la descarga o imprime y avisa a la tienda por WhatsApp.

Para descargar todas las hojas en CSV:
`https://urbantecstore.com/api/reclamos?clave=<ADMIN_KEY>`
La clave se configura con `npx wrangler secret put ADMIN_KEY` dentro de `cloudflare/`.

## Certificado de garantía

`https://urbantecstore.com/herramientas/certificado-de-garantia/` genera el certificado de
garantía escrita para cada pedido. Está oculto para buscadores y no guarda datos.

## Despliegue automático

`.github/workflows/urbantecstore-deploy.yml` publica la tienda en cada cambio cuando el
repositorio tiene los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Sin ellos, se omite.
El token necesita: Workers Scripts (Edit) y Workers Routes (Edit) de la zona urbantecstore.com.

## SEO y GEO

Metadatos, canonical, Open Graph con imagen propia (`public/og.jpg`), JSON-LD (OnlineStore,
Product con política de devolución real, FAQPage, BreadcrumbList), sitemap, robots y `/llms.txt`.
