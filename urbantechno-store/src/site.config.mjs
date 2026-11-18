// Datos de la tienda. Todo lo que está vacío ('') se oculta en la web hasta que lo completes.
export const SITE = {
  name: 'Urbantecstore',
  shortName: 'Urbantecstore',
  url: 'https://urbantecstore.com',
  tagline: 'Tecnología, zapatillas y lentes 100 % originales con garantía escrita.',
  description:
    'Tienda online en Perú de celulares, laptops, consolas, zapatillas y lentes de sol 100 % originales, nuevos sellados o seminuevos certificados. Garantía escrita de 6 meses y envíos a todo el Perú.',
  whatsapp: '51930999527',
  whatsappDisplay: '+51 930 999 527',
  // Pendiente: activa Email Routing en Cloudflare y luego escribe aquí el correo.
  email: '',
  hours: 'Lun a Sáb, 9:00 a 19:00',
  city: 'Lima, Perú',
  // Pendiente: datos legales del proveedor (obligatorios para el Libro de Reclamaciones).
  razonSocial: '',
  ruc: '',
  direccion: '',
  // Pendiente: URLs reales de tus redes.
  instagram: '',
  tiktok: '',
  updated: 'Noviembre de 2026',
};

export const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const socials = () => {
  const out = [];
  if (SITE.instagram) out.push({ name: 'Instagram', url: SITE.instagram });
  if (SITE.tiktok) out.push({ name: 'TikTok', url: SITE.tiktok });
  return out;
};

// Identificación del proveedor en una línea, solo con los datos que existan.
export const providerLine = () =>
  [SITE.razonSocial, SITE.ruc && `RUC ${SITE.ruc}`, SITE.direccion].filter(Boolean).join(' · ');
