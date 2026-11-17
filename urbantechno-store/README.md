# Urbantechno_store

Tienda online estática en Astro para Urbantechno_store (Perú): celulares, laptops, consolas, zapatillas y lentes de sol.

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
