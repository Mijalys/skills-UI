// Datos de la tienda. Cambia aquí el número de WhatsApp, el correo y la URL final.
export const SITE = {
  name: 'Urbantecstore',
  shortName: 'Urbantecstore',
  url: 'https://urbantecstore.com',
  tagline: 'Tecnología, zapatillas y lentes 100 % originales con garantía escrita.',
  description:
    'Tienda online en Perú de celulares, laptops, consolas, zapatillas y lentes de sol 100 % originales, nuevos sellados o seminuevos certificados. Garantía escrita de 6 meses y envíos a todo el Perú.',
  // Reemplazar por el número oficial, solo dígitos con código de país.
  whatsapp: '51999999999',
  whatsappDisplay: '+51 999 999 999',
  email: 'hola@urbantecstore.com',
  hours: 'Lun a Sáb, 9:00 a 19:00',
  city: 'Lima, Perú',
  instagram: 'https://www.instagram.com/urbantecstore',
  tiktok: 'https://www.tiktok.com/@urbantecstore',
  updated: 'Noviembre de 2026',
};

export const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
