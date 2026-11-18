# Urbantecstore

Tienda online estática en Astro para Urbantecstore (Perú): celulares, laptops, consolas, zapatillas y lentes de sol.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

- Datos de la tienda (WhatsApp, correo, URL): `src/site.config.mjs`
- Catálogo y categorías: `src/data/products.ts`
- Preguntas frecuentes: `src/data/faq.ts`
- Paleta y tipografía (Barlow Condensed / Barlow): `src/styles/global.css`

El pedido se envía por WhatsApp desde el carrito; no hay pasarela de pago integrada.
SEO: metadatos, canonical, Open Graph, JSON-LD (OnlineStore, Product, FAQPage, BreadcrumbList), sitemap y `robots.txt`.
GEO: `/llms.txt` con resumen de políticas, categorías y productos.
Imágenes: Unsplash (referenciales, reemplazar por fotos propias).

## Despliegue en Cloudflare (Worker)

El sitio se sirve desde un Worker que lleva `dist/` empaquetado. El token necesita los permisos Account › Workers Scripts › Edit y Zone › Workers Routes › Edit.

```sh
npm run build
node cloudflare/build-worker.mjs
cd cloudflare && CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npx wrangler deploy
```
