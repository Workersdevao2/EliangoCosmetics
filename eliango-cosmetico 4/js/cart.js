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
  if (document.getElementById('cartPanel')?.classList.contains('open') && typeof renderCartPanel === 'function') {
    renderCartPanel();
  }
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


// ---------- Mini cart panel ----------
function isEnLang() {
  return document.body.classList.contains('en');
}

function renderCartPanel() {
  const body = document.getElementById('cartPanelBody');
  const footer = document.getElementById('cartPanelFooter');
  const subEl = document.getElementById('cartPanelSubtotal');
  if (!body) return;

  const cart = getCart();
  const en = isEnLang();

  if (!cart.length) {
    body.innerHTML = `<p class="cart-panel-empty">${en ? 'Your cart is empty' : 'O seu carrinho está vazio'}</p>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = '';

  body.innerHTML = cart.map(i => {
    const title = en ? i.titleEn : i.titlePt;
    return `<div class="cart-panel-item" data-id="${i.id}">
      <img src="${i.img}" alt="${title}">
      <div>
        <h4>${title}</h4>
        <div class="meta">${i.price} × ${i.qty}</div>
        <div class="row-actions">
          <button type="button" data-act="dec" aria-label="-">−</button>
          <span>${i.qty}</span>
          <button type="button" data-act="inc" aria-label="+">+</button>
          <button type="button" class="rm" data-act="rm">${en ? 'remove' : 'remover'}</button>
        </div>
      </div>
      <div class="line-total">${formatKz(i.priceNum * i.qty)}</div>
    </div>`;
  }).join('');

  if (subEl) subEl.textContent = formatKz(cartTotal());

  body.querySelectorAll('.cart-panel-item').forEach(row => {
    const id = row.dataset.id;
    row.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = getCart().find(x => x.id === id);
        if (!item) return;
        if (btn.dataset.act === 'inc') setQty(id, item.qty + 1);
        if (btn.dataset.act === 'dec') {
          if (item.qty <= 1) removeFromCart(id);
          else setQty(id, item.qty - 1);
        }
        if (btn.dataset.act === 'rm') removeFromCart(id);
        renderCartPanel();
        // also refresh checkout page if present
        if (typeof window.__renderCheckout === 'function') window.__renderCheckout();
      });
    });
  });
}

function openCartPanel() {
  renderCartPanel();
  document.getElementById('cartPanel')?.classList.add('open');
  document.getElementById('cartPanelOverlay')?.classList.add('open');
  document.getElementById('cartPanel')?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCartPanel() {
  document.getElementById('cartPanel')?.classList.remove('open');
  document.getElementById('cartPanelOverlay')?.classList.remove('open');
  document.getElementById('cartPanel')?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  document.getElementById('cartToggle')?.addEventListener('click', openCartPanel);
  document.getElementById('cartPanelClose')?.addEventListener('click', closeCartPanel);
  document.getElementById('cartPanelOverlay')?.addEventListener('click', closeCartPanel);
  document.getElementById('cartPanelContinue')?.addEventListener('click', closeCartPanel);
  document.getElementById('cartPanelContinueEn')?.addEventListener('click', closeCartPanel);
});
