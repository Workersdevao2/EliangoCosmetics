// Eliango Cosmético - Main JS

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Header scroll + announce bar ----------
  const header = document.getElementById('header');
  const announce = document.getElementById('announce');
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (y > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide announce on scroll down, show near top
    if (y > 80 && y > lastScrollY) {
      announce.classList.add('hidden');
      header.classList.add('announce-hidden');
    } else if (y < 40) {
      announce.classList.remove('hidden');
      header.classList.remove('announce-hidden');
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll(); // initial state

  // ---------- Mobile left drawer ----------
  const navToggle = document.getElementById('navToggle');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    navToggle.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    navToggle.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  if (navToggle && drawer) {
    navToggle.addEventListener('click', () => {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });
  }
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on nav link click
  drawer?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });

  // ---------- Language toggle ----------
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

  // Service cards → details + Book now → appointment form
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.details);
      const isEn = document.body.classList.contains('en');
      const title = isEn ? data.titleEn : data.titlePt;
      const desc = isEn ? data.descEn : data.descPt;
      const details = isEn ? data.detailsEn : data.detailsPt;
      const price = data.price;
      const img = data.img;
      const titlePt = data.titlePt;

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
            <button type="button" class="btn btn-primary" id="bookNowBtn" data-service="${titlePt.replace(/"/g, '&quot;')}" data-service-en="${(data.titleEn || '').replace(/"/g, '&quot;')}">
              ${isEn ? 'Book now' : 'Marcar agora'}
            </button>
          </div>
        </div>
      `);

      document.getElementById('bookNowBtn')?.addEventListener('click', () => {
        const svc = isEn ? data.titleEn : data.titlePt;
        openModal(`
          <div class="modal-body">
            <h2>${isEn ? 'Book appointment' : 'Marcar serviço'}</h2>
            <div class="modal-service-preset">${isEn ? 'Service' : 'Serviço'}: <strong>${svc}</strong></div>
            <form class="modal-form" id="appointmentForm">
              <input type="hidden" name="service" value="${svc}">
              <div class="form-group">
                <label>${isEn ? 'Full name' : 'Nome completo'}</label>
                <input type="text" name="name" required>
              </div>
              <div class="form-group">
                <label>WhatsApp / Telefone</label>
                <input type="tel" name="phone" required placeholder="+244 ...">
              </div>
              <div class="form-group">
                <label>${isEn ? 'Preferred date' : 'Data preferida'}</label>
                <input type="date" name="date">
              </div>
              <div class="form-group">
                <label>${isEn ? 'Preferred time' : 'Horário preferido'}</label>
                <input type="text" name="time" placeholder="${isEn ? 'e.g. morning / 10:00' : 'ex: manhã / 10:00'}">
              </div>
              <div class="form-group">
                <label>${isEn ? 'Notes (optional)' : 'Notas (opcional)'}</label>
                <textarea name="notes"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">${isEn ? 'Send via WhatsApp' : 'Enviar pelo WhatsApp'}</button>
            </form>
          </div>
        `);
        document.getElementById('appointmentForm')?.addEventListener('submit', e => {
          e.preventDefault();
          const f = e.target;
          const text = encodeURIComponent(
            (isEn
              ? `Hello! I would like to book an appointment.\n\nService: ${f.service.value}\nName: ${f.name.value}\nPhone: ${f.phone.value}\nDate: ${f.date.value || '—'}\nTime: ${f.time.value || '—'}\nNotes: ${f.notes.value || '—'}`
              : `Olá! Gostaria de marcar um serviço.\n\nServiço: ${f.service.value}\nNome: ${f.name.value}\nTelefone: ${f.phone.value}\nData: ${f.date.value || '—'}\nHorário: ${f.time.value || '—'}\nNotas: ${f.notes.value || '—'}`)
          );
          window.open(`https://wa.me/244938720335?text=${text}`, '_blank');
          closeModal();
        });
      });
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

  // Course cards → details + enrol link to form page
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.details);
      const isEn = document.body.classList.contains('en');
      const title = isEn ? data.titleEn : data.titlePt;
      const desc = isEn ? data.descEn : data.descPt;
      const details = isEn ? data.detailsEn : data.detailsPt;
      const schedule = isEn ? data.scheduleEn : data.schedulePt;
      const img = data.img;
      const cursoParam = encodeURIComponent(data.titlePt);

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
            <a href="inscricao.html?curso=${cursoParam}" class="btn btn-primary">
              ${isEn ? 'Enrol now' : 'Inscrever-me'}
            </a>
          </div>
        </div>
      `);
    });
  });

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---------- Active nav on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a, .drawer-nav a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ---------- Gallery lightbox ----------
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.querySelector('img')?.src;
      if (!src) return;
      openModal(`
        <div class="modal-carousel">
          <div class="slides">
            <div class="slide"><img src="${src}" alt="Galeria"></div>
          </div>
        </div>
      `);
    });
  });

  // ---------- Bilingual form placeholders ----------
  function updatePlaceholders(lang) {
    document.querySelectorAll('[data-ph-pt]').forEach(el => {
      el.placeholder = lang === 'en' ? (el.dataset.phEn || el.placeholder) : (el.dataset.phPt || el.placeholder);
    });
  }
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updatePlaceholders(btn.dataset.setLang);
    });
  });
  updatePlaceholders(savedLang);

  // ---------- Footer newsletter → WhatsApp ----------
  document.getElementById('footerSignup')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email) return;
    const isEn = document.body.classList.contains('en');
    const text = encodeURIComponent(
      isEn
        ? `Hello! I would like to receive updates from Eliango Cosmético.\nEmail: ${email}`
        : `Olá! Gostaria de receber novidades da Eliango Cosmético.\nEmail: ${email}`
    );
    window.open(`https://wa.me/244938720335?text=${text}`, '_blank');
    e.target.reset();
  });
});
