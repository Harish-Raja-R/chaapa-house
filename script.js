/* ===================================================
   CHAAPA HOUSE – JavaScript Interactions
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL EFFECT ─── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── MOBILE NAV TOGGLE ─── */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navLinksEl.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav when a link is clicked
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* ─── SCROLL ANIMATIONS ─── */
  const animEls = document.querySelectorAll('[data-anim]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(el => observer.observe(el));

  /* ─── FISH FILTER TABS ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form values
      const name = form.querySelector('input[type="text"]').value.trim();
      const phone = form.querySelector('input[type="tel"]').value.trim();
      const interest = form.querySelector('select').value;
      const message = form.querySelector('textarea').value.trim();

      if (!name) {
        showToast('Please enter your name', 'error');
        return;
      }

      // Build WhatsApp message
      let waMsg = `Hi Chaapa House! 👋\n\nI'm *${name}*`;
      if (phone) waMsg += ` (+${phone})`;
      if (interest) waMsg += `\n\nI'm interested in: *${interest}*`;
      if (message) waMsg += `\n\nMessage: ${message}`;
      waMsg += '\n\nPlease get in touch. Thank you!';

      const waUrl = `https://wa.me/917708179983?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');

      showToast('Redirecting to WhatsApp...', 'success');
      form.reset();
    });
  }

  /* ─── TOAST NOTIFICATION ─── */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 28px;
      background: ${type === 'success' ? '#0BA7A7' : '#E74C3C'};
      color: white;
      padding: 14px 22px;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideInToast 0.3s ease forwards;
    `;
    toast.textContent = message;

    // Add keyframe
    if (!document.querySelector('#toast-style')) {
      const style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = `
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── HERO IMAGE FALLBACK ─── */
  // Try a series of aquarium images if the first fails
  const heroImages = [
    'https://images.unsplash.com/photo-1619634280748-c5f0c6c21de9?w=600&q=80',
    'https://images.unsplash.com/photo-1536183922588-166604504d5e?w=600&q=80',
    'https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?w=600&q=80',
  ];

  const heroImg = document.querySelector('.hero-img-card img');
  if (heroImg) {
    let idx = 0;
    heroImg.addEventListener('error', function() {
      idx++;
      if (idx < heroImages.length) {
        this.src = heroImages[idx];
      } else {
        // Final fallback: create a teal gradient placeholder
        const wrap = this.closest('.hero-img-card');
        wrap.style.background = 'linear-gradient(135deg, #0BA7A7, #078585)';
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.justifyContent = 'center';
        this.style.display = 'none';
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 6rem; opacity: 0.5;';
        icon.textContent = '🐠';
        wrap.appendChild(icon);
      }
    });
    // Trigger initial load attempt
    if (!heroImg.complete || heroImg.naturalWidth === 0) {
      heroImg.src = heroImages[0];
    }
  }

  /* ─── COUNTER ANIMATION FOR STATS ─── */
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const text = num.textContent;
          const match = text.match(/(\d+)(\S*)/);
          if (match) {
            animateCounter(num, parseInt(match[1]), match[2]);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ─── PARALLAX EFFECT ON HERO ORBS ─── */
  window.addEventListener('mousemove', (e) => {
    const orb1 = document.querySelector('.hero-orb-1');
    const orb2 = document.querySelector('.hero-orb-2');
    if (!orb1 || !orb2) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    orb1.style.transform = `translate(${x}px, ${y}px)`;
    orb2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  }, { passive: true });

});
