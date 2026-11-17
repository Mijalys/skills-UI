export interface Faq { q: string; a: string }
export const faqs: Faq[] = [
  { q: '¿Los productos son originales?', a: 'Sí, 100 %. Vendemos solo productos nuevos sellados de fábrica o seminuevos verificados por nuestro equipo. No trabajamos con réplicas ni importaciones sin garantía.' },
  { q: '¿Qué significa seminuevo certificado?', a: 'Es un equipo que ya tuvo un dueño y que revisamos técnica y estéticamente antes de publicarlo. Probamos batería, pantalla, cámaras, puertos y cuentas. Su estado estético se detalla en la ficha con un grado A o B.' },
  { q: '¿Cuándo se confirma mi pedido?', a: 'Cuando verificamos el pago. Puedes pagar por transferencia, Yape, Plin, Agora o tarjeta. Te confirmamos por WhatsApp y preparamos el envío.' },
  { q: '¿Envían a provincias?', a: 'Sí, enviamos a todo el Perú con couriers autorizados. El plazo es referencial y depende de tu ciudad o distrito. Al despachar te enviamos el código de seguimiento.' },
  { q: '¿Cómo sigo mi pedido?', a: 'Con el código de seguimiento que te enviamos por WhatsApp al despachar. Puedes rastrearlo en la web del courier o consultarnos directamente con tu número de pedido.' },
  { q: '¿Qué garantía tienen los celulares, laptops y consolas?', a: 'Seis meses desde que recibes el producto, tanto en nuevos como en seminuevos certificados. Cubre fallas técnicas internas y defectos de fábrica. Si se confirma el defecto, reparamos, reemplazamos o devolvemos el dinero.' },
  { q: '¿La garantía cubre pantalla rota o contacto con agua?', a: 'No. Tampoco cubre reparaciones hechas por terceros, daños por cargadores genéricos, desgaste normal de batería o bloqueos de cuentas como iCloud o Google.' },
  { q: '¿Puedo cambiar la talla de mis zapatillas?', a: 'Sí, dentro de los 7 días calendario desde que las recibes, siempre que estén sin uso, limpias, con etiquetas y caja original intactas. El envío del cambio lo pagas tú y depende del stock disponible.' },
  { q: '¿Puedo devolver un producto si cambié de opinión?', a: 'No, una vez abierto el sello de fábrica o usado el artículo. Son equipos electrónicos y productos de uso personal. Si recibiste algo distinto o con falla evidente, repórtalo en 48 horas y nosotros asumimos los envíos.' },
  { q: '¿Reciben mi equipo usado como parte de pago?', a: 'No. Solo vendemos de forma directa, no recibimos equipos usados ni hacemos canjes.' },
  { q: '¿Reparan equipos?', a: 'No ofrecemos servicio técnico externo ni mantenimiento. La evaluación técnica aplica solo a productos comprados en Urbantechno_store dentro de su garantía.' },
  { q: '¿Dónde presento un reclamo?', a: 'En nuestro Libro de Reclamaciones virtual, enlazado en el pie de página, conforme a la normativa de Indecopi. También puedes escribirnos por WhatsApp o correo.' },
];
export const faqJsonLd = (list: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
