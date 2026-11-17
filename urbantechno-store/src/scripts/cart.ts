// Carrito mínimo en localStorage. Sin backend: el pedido se envía por WhatsApp.
export interface CartItem { slug: string; name: string; price: number; size?: string; qty: number; image: string }
const KEY = 'ut_cart_v1';

export const readCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};
export const writeCart = (items: CartItem[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  document.dispatchEvent(new CustomEvent('cart:change', { detail: items }));
};
export const addToCart = (item: Omit<CartItem, 'qty'>, qty = 1) => {
  const items = readCart();
  const found = items.find((i) => i.slug === item.slug && i.size === item.size);
  if (found) found.qty += qty; else items.push({ ...item, qty });
  writeCart(items);
};
export const soles = (n: number) => 'S/ ' + n.toLocaleString('es-PE');

const paintCount = () => {
  const n = readCart().reduce((a, i) => a + i.qty, 0);
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
  });
};
document.addEventListener('cart:change', paintCount);
paintCount();

// Botón "Agregar al carrito" en la ficha
document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const sizeSel = document.querySelector<HTMLSelectElement>('[data-size]');
    const size = sizeSel?.value || undefined;
    if (sizeSel && !size) { sizeSel.focus(); sizeSel.classList.add('is-error'); return; }
    addToCart({ slug: btn.dataset.slug!, name: btn.dataset.name!, price: Number(btn.dataset.price), image: btn.dataset.image!, size });
    const toast = document.querySelector<HTMLElement>('[data-toast]');
    if (toast) { toast.hidden = false; setTimeout(() => (toast.hidden = true), 3500); }
  });
});
