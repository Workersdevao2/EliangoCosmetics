// Eliango Cosmético - Main JS

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close nav on link click
  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // Language toggle
  const langBtns = document.querySelectorAll('[data-set-lang]');
  const savedLang = localStorage.getItem('eliango-lang') || 'pt';

  function setLang(lang) {
    document.body.classList.toggle('en', lang === 'en');
    document.documentElement.lang = lang;
    localStorage.setItem('eliango-lang', lang);
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.setLang === lang);
    });
  }

  setLang(savedLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.setLang));
  });

  // Product tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const products = document.querySelectorAll('.product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      // Activate matching language buttons for same tab
      document.querySelectorAll(`.tab-btn[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));

      products.forEach(card => {
        if (tab === 'all' || card.dataset.cat === tab) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Contact form → WhatsApp
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    const subjectMap = {
      servico: 'Marcar serviço',
      formacao: 'Formação',
      produto: 'Produtos',
      outro: 'Outro'
    };

    const text = `Olá! Sou ${name}.\nTelefone: ${phone}\nAssunto: ${subjectMap[subject] || subject}\n\n${message}`;
    const url = `https://wa.me/244938720335?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
});
