// Eliango Cosmético - Main JS

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Language toggle
  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('eliango-lang') || 'pt';
  setLang(savedLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.setLang;
      setLang(lang);
      localStorage.setItem('eliango-lang', lang);
    });
  });

  function setLang(lang) {
    document.body.classList.toggle('en', lang === 'en');
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.setLang === lang));
  }

  // Product tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-btn[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
      productCards.forEach(card => {
        if (tab === 'all' || card.dataset.cat === tab) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Contact form → WhatsApp
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();
      const text = encodeURIComponent(
        `Olá! Sou ${name}.\nTelefone: ${phone}\nAssunto: ${subject}\n\n${message}`
      );
      window.open(`https://wa.me/244938720335?text=${text}`, '_blank');
    });
  }

  // ===== MODAL SYSTEM =====
  const overlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openModal(html) {
    modalContent.innerHTML = html;
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
    initCarousel();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    modalContent.innerHTML = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  function initCarousel() {
    const carousel = modalContent.querySelector('.modal-carousel');
    if (!carousel) return;
    const slides = carousel.querySelector('.slides');
    const total = carousel.querySelectorAll('.slide').length;
    if (total < 2) return;
    let idx = 0;
    const dots = carousel.querySelector('.carousel-dots');

    function go(i) {
      idx = (i + total) % total;
      slides.style.transform = `translateX(-${idx * 100}%)`;
      if (dots) {
        dots.querySelectorAll('span').forEach((d, j) => d.classList.toggle('active', j === idx));
      }
    }

    carousel.querySelector('.carousel-btn.prev')?.addEventListener('click', () => go(idx - 1));
    carousel.querySelector('.carousel-btn.next')?.addEventListener('click', () => go(idx + 1));
    dots?.querySelectorAll('span').forEach((d, j) => d.addEventListener('click', () => go(j)));
  }

  // Service cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.details);
      const isEn = document.body.classList.contains('en');
      const title = isEn ? data.titleEn : data.titlePt;
      const desc = isEn ? data.descEn : data.descPt;
      const details = isEn ? data.detailsEn : data.detailsPt;
      const price = data.price;
      const img = data.img;
      const wa = encodeURIComponent(
        isEn
          ? `Hello! I would like to book: ${data.titleEn}`
          : `Olá! Gostaria de marcar: ${data.titlePt}`
      );

      openModal(`
        <div class="modal-carousel">
          <div class="slides">
            <div class="slide"><img src="${img}" alt="${title}"></div>
          </div>
        </div>
        <div class="modal-body">
          <h2>${title}</h2>
          <div class="modal-price">${price}</div>
          <p class="modal-desc">${desc}</p>
          <div class="modal-details">
            <h4>${isEn ? 'What is included' : 'O que está incluído'}</h4>
            <ul>${details.map(d => '<li>' + d + '</li>').join('')}</ul>
          </div>
          <div class="modal-actions">
            <a href="https://wa.me/244938720335?text=${wa}" class="btn btn-whatsapp" target="_blank" rel="noopener">
              ${isEn ? 'Book via WhatsApp' : 'Marcar pelo WhatsApp'}
            </a>
          </div>
        </div>
      `);
    });
  });

  // Product cards
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.details);
      const isEn = document.body.classList.contains('en');
      const title = isEn ? data.titleEn : data.titlePt;
      const desc = isEn ? data.descEn : data.descPt;
      const details = isEn ? data.detailsEn : data.detailsPt;
      const price = data.price;
      const tag = data.tag;
      const tagLabel = isEn
        ? { new: 'New', available: 'Available', unavailable: 'Unavailable' }[tag]
        : { new: 'Novo', available: 'Disponível', unavailable: 'Indisponível' }[tag];
      const images = data.images || [data.img];
      const canOrder = tag !== 'unavailable';
      const wa = encodeURIComponent(
        isEn
          ? `Hello! I want to order: ${data.titleEn} (${price})`
          : `Olá! Quero encomendar: ${data.titlePt} (${price})`
      );

      const slidesHtml = images.map(src => '<div class="slide"><img src="' + src + '" alt="' + title + '"></div>').join('');
      const dotsHtml = images.length > 1
        ? '<div class="carousel-dots">' + images.map((_, i) => '<span class="' + (i === 0 ? 'active' : '') + '"></span>').join('') + '</div>'
        : '';
      const navHtml = images.length > 1
        ? '<button class="carousel-btn prev" type="button" aria-label="Previous">‹</button><button class="carousel-btn next" type="button" aria-label="Next">›</button>'
        : '';

      openModal(`
        <div class="modal-carousel">
          <div class="slides">${slidesHtml}</div>
          ${navHtml}
          ${dotsHtml}
        </div>
        <div class="modal-body">
          <span class="modal-tag ${tag}">${tagLabel}</span>
          <h2>${title}</h2>
          <div class="modal-price">${price}</div>
          <p class="modal-desc">${desc}</p>
          <div class="modal-details">
            <h4>${isEn ? 'Details' : 'Detalhes'}</h4>
            <ul>${details.map(d => '<li>' + d + '</li>').join('')}</ul>
          </div>
          <div class="modal-actions">
            ${canOrder
              ? '<a href="https://wa.me/244938720335?text=' + wa + '" class="btn btn-whatsapp" target="_blank" rel="noopener">' +
                (isEn ? 'Order via WhatsApp' : 'Encomendar pelo WhatsApp') + '</a>'
              : '<button class="btn btn-outline-dark" disabled style="opacity:0.6;cursor:not-allowed;">' +
                (isEn ? 'Currently unavailable' : 'Indisponível de momento') + '</button>'
            }
          </div>
        </div>
      `);
    });
  });

  // Course cards
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.details);
      const isEn = document.body.classList.contains('en');
      const title = isEn ? data.titleEn : data.titlePt;
      const desc = isEn ? data.descEn : data.descPt;
      const details = isEn ? data.detailsEn : data.detailsPt;
      const schedule = isEn ? data.scheduleEn : data.schedulePt;
      const img = data.img;
      const wa = encodeURIComponent(
        isEn
          ? `Hello! I want to enroll in: ${data.titleEn}`
          : `Olá! Quero inscrever-me em: ${data.titlePt}`
      );

      openModal(`
        <div class="modal-carousel">
          <div class="slides">
            <div class="slide"><img src="${img}" alt="${title}"></div>
          </div>
        </div>
        <div class="modal-body">
          <h2>${title}</h2>
          <div class="modal-price">${schedule}</div>
          <p class="modal-desc">${desc}</p>
          <div class="modal-details">
            <h4>${isEn ? 'What you will learn' : 'O que vai aprender'}</h4>
            <ul>${details.map(d => '<li>' + d + '</li>').join('')}</ul>
          </div>
          <div class="modal-actions">
            <a href="https://wa.me/244938720335?text=${wa}" class="btn btn-whatsapp" target="_blank" rel="noopener">
              ${isEn ? 'Join now via WhatsApp' : 'Inscrever-me pelo WhatsApp'}
            </a>
          </div>
        </div>
      `);
    });
  });
});
