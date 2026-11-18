import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.mjs';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/carrito/') && !page.includes('/404') && !page.includes('/herramientas/') })],
  build: { inlineStylesheets: 'auto' },
});
