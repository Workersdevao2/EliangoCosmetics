// Eliango Cosmético — Cart (localStorage)
const CART_KEY = 'eliango-cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadges();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
}

function setQty(id, qty) {
  let cart = getCart();
  cart = cart.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.priceNum * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function formatKz(n) {
  return n.toLocaleString('pt-AO') + ' Kz';
}

function parsePrice(str) {
  const n = parseInt(String(str).replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function updateCartBadges() {
  const count = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? '' : 'none';
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => {
    el.textContent = count;
  });
}

document.addEventListener('DOMContentLoaded', updateCartBadges);

// Product catalogue (shared)
const PRODUCTS = [
  { id: 'wig1', cat: 'wigs', titlePt: 'Peruca Lace Front', titleEn: 'Lace Front Wig', price: '35.000 Kz', priceNum: 35000, tag: 'new', img: 'images/wig1.jpg' },
  { id: 'wig2', cat: 'wigs', titlePt: 'Peruca Curta', titleEn: 'Short Wig', price: '28.000 Kz', priceNum: 28000, tag: 'available', img: 'images/wig-alt.jpg' },
  { id: 'skin1', cat: 'skincare', titlePt: 'Creme Hidratante', titleEn: 'Moisturizing Cream', price: '6.500 Kz', priceNum: 6500, tag: 'available', img: 'images/skincare1.jpg' },
  { id: 'skin2', cat: 'skincare', titlePt: 'Kit Limpeza Facial', titleEn: 'Facial Cleansing Kit', price: '12.000 Kz', priceNum: 12000, tag: 'new', img: 'images/skincare2.jpg' },
  { id: 'mk1', cat: 'makeup', titlePt: 'Base HD', titleEn: 'HD Foundation', price: '8.500 Kz', priceNum: 8500, tag: 'available', img: 'images/makeup-prod1.jpg' },
  { id: 'mk2', cat: 'makeup', titlePt: 'Paleta de Sombras', titleEn: 'Eyeshadow Palette', price: '9.000 Kz', priceNum: 9000, tag: 'new', img: 'images/makeup-prod2.jpg' },
  { id: 'mk3', cat: 'makeup', titlePt: 'Kit de Pincéis', titleEn: 'Brush Kit', price: '7.500 Kz', priceNum: 7500, tag: 'available', img: 'images/makeup-brushes.jpg' },
  { id: 'hair1', cat: 'hair', titlePt: 'Óleo Capilar', titleEn: 'Hair Oil', price: '4.500 Kz', priceNum: 4500, tag: 'available', img: 'images/haircare1.jpg' },
  { id: 'hair2', cat: 'hair', titlePt: 'Shampoo & Condicionador', titleEn: 'Shampoo & Conditioner', price: '8.000 Kz', priceNum: 8000, tag: 'unavailable', img: 'images/haircare2.jpg' },
  { id: 'frag1', cat: 'fragrance', titlePt: 'Perfume Feminino', titleEn: 'Women Perfume', price: '15.000 Kz', priceNum: 15000, tag: 'available', img: 'images/perfume1.jpg' },
  { id: 'frag2', cat: 'fragrance', titlePt: 'Body Splash', titleEn: 'Body Splash', price: '5.500 Kz', priceNum: 5500, tag: 'new', img: 'images/perfume2.jpg' },
];

const COURSES = [
  'Maquiagem Profissional',
  'Auto-Maquilhagem',
  'Cabeleireiro Profissional',
  'Manicure & Pedicure',
  'Estética Geral',
  'Barbearia Profissional',
];
