import type { APIRoute } from 'astro';
import { SITE } from '../site.config.mjs';
import { categories, products, soles } from '../data/products';
import { faqs } from '../data/faq';

export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `Tienda online peruana de venta directa. Moneda: soles (PEN), impuestos incluidos. Pagos: transferencia, Yape, Plin, Agora, tarjeta. Envíos a todo el Perú con código de seguimiento. Atención por WhatsApp ${SITE.whatsappDisplay}${SITE.email ? ` y correo ${SITE.email}` : ''}.`,
    '',
    '## Políticas clave',
    '- Garantía escrita de 6 meses en celulares, laptops y consolas (nuevos y seminuevos certificados), desde la recepción. Cubre fallas internas y defectos de fábrica. No cubre golpes, líquidos, apertura por terceros, cargadores genéricos, desgaste normal ni bloqueos de cuentas.',
    '- Producto distinto o con falla evidente al abrir: reportar en 48 horas con foto o video; la tienda asume los envíos.',
    '- Zapatillas: cambio de talla o modelo en 7 días calendario, sin uso, con caja y etiquetas; envío a cargo del cliente.',
    '- No hay devoluciones por cambio de opinión una vez abierto el sello o usado el artículo.',
    '- Condiciones: "Nuevo sellado" (caja de fábrica) y "Seminuevo certificado" (revisado, grado A sin marcas visibles o grado B con micro marcas).',
    '- No ofrece reparación externa ni recibe usados como parte de pago. Libro de Reclamaciones virtual disponible.',
    '',
    '## Categorías',
    ...categories.map((c) => `- [${c.name}](${SITE.url}/tienda/${c.slug}/): ${c.description}`),
    '',
    '## Productos',
    ...products.map((p) => `- [${p.name}](${SITE.url}/producto/${p.slug}/): ${p.brand}, ${p.condition === 'nuevo' ? 'nuevo sellado' : `seminuevo certificado grado ${p.grade}`}, ${soles(p.price)}. ${p.short}`),
    '',
    '## Ayuda',
    `- [Envíos](${SITE.url}/ayuda/envios/)`,
    `- [Pagos](${SITE.url}/ayuda/pagos/)`,
    `- [Garantía](${SITE.url}/ayuda/garantia/)`,
    `- [Cambios y devoluciones](${SITE.url}/ayuda/cambios-y-devoluciones/)`,
    `- [Seguimiento de pedido](${SITE.url}/seguimiento/)`,
    `- [Preguntas frecuentes](${SITE.url}/ayuda/preguntas-frecuentes/)`,
    '',
    '## Legal',
    `- [Términos y condiciones](${SITE.url}/legal/terminos-y-condiciones/)`,
    `- [Política de cambios, devoluciones y garantías](${SITE.url}/legal/politica-de-cambios-devoluciones-y-garantias/)`,
    `- [Política de privacidad](${SITE.url}/legal/politica-de-privacidad/)`,
    `- [Libro de Reclamaciones](${SITE.url}/libro-de-reclamaciones/)`,
    '',
    '## Preguntas frecuentes',
    ...faqs.map((f) => `- ${f.q} ${f.a}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
