/* ==========================================
   ЮрПрофессионал — main.js
   Conversion-optimized JavaScript
   ========================================== */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initFAQ();
  initForms();
  initPhoneMask();
  initSmoothScroll();
  initFloatButton();
});

// ===== HEADER SCROLL =====
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const btn = document.getElementById('burger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    // Animate burger
    btn.classList.toggle('active', isOpen);
  });

  // Close on link click
  menu.querySelectorAll('.mobile-menu__link, .btn-primary').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
  });
}

// ===== SCROLL REVEAL (Intersection Observer) =====
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(i * 80, 400));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * target);
      el.textContent = current.toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(f => {
        f.classList.remove('open');
        const q = f.querySelector('.faq-item__question');
        const a = f.querySelector('.faq-item__answer');
        if (q) q.setAttribute('aria-expanded', 'false');
        if (a) {
          a.hidden = true;
          a.style.maxHeight = '';
        }
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ===== FORMS =====
function initForms() {
  const mainForm = document.getElementById('main-form');
  const footerForm = document.getElementById('footer-form');

  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(mainForm, 'form-success');
    });
  }

  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(footerForm, null);
    });
  }
}

function handleFormSubmit(form, successId) {
  const submitBtn = form.querySelector('[type=submit]');

  // Basic validation
  const requiredFields = form.querySelectorAll('[required]');
  let valid = true;

  requiredFields.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      field.style.borderColor = '#e53e3e';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!valid) {
    requiredFields[0]?.focus();
    shakeForm(form);
    return;
  }

  // Simulate submission
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
  }

  // Collect data
  const data = {};
  new FormData(form).forEach((val, key) => { data[key] = val; });
  console.log('[Form Submit]', data);

  // Push to dataLayer (Google Tag Manager / Analytics)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'lead_form_submit',
      formName: form.id,
      ...data
    });
  }

  // Google Ads conversion tracking
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL'
    });
  }

  setTimeout(() => {
    if (successId) {
      form.hidden = true;
      const successEl = document.getElementById(successId);
      if (successEl) {
        successEl.hidden = false;
        successEl.style.animation = 'fadeUp 0.5s ease forwards';
      }
    } else {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Заявка отправлена!';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
          submitBtn.textContent = 'Отправить заявку';
          submitBtn.style.background = '';
        }, 3000);
      }
    }
  }, 1200);
}

function shakeForm(form) {
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

// ===== PHONE MASK =====
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let val = input.value.replace(/\D/g, '');

      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (!val.startsWith('7') && val.length > 0) val = '7' + val;

      val = val.slice(0, 11);

      let formatted = '';
      if (val.length >= 1) formatted = '+7';
      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length > 4) formatted += ') ' + val.slice(4, 7);
      if (val.length > 7) formatted += '-' + val.slice(7, 9);
      if (val.length > 9) formatted += '-' + val.slice(9, 11);

      input.value = formatted;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value.length <= 3) {
        input.value = '';
      }
    });
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerH = document.getElementById('header')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ===== FLOATING CALL BUTTON =====
function initFloatButton() {
  const btn = document.getElementById('float-call-btn');
  if (!btn) return;

  // Show after scrolling down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  }, { passive: true });
}

// ===== FORM SHAKE ANIMATION =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
.form-input.error {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15) !important;
}
`;
document.head.appendChild(shakeStyle);

// ===== GOOGLE ADS CLICK TRACKING =====
// Track all CTA button clicks
document.querySelectorAll('[id$="-btn"], [id$="-call"]').forEach(el => {
  el.addEventListener('click', () => {
    const eventName = el.href?.startsWith('tel:') ? 'phone_call_click' : 'cta_click';
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: el.id,
      });
    }
    if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, elementId: el.id });
    }
  });
});

// ===== SESSION TIMER (Urgency Widget) =====
// Shows how long the user has been on site
(function () {
  const urgencyEl = document.querySelector('.form-urgency');
  if (!urgencyEl) return;

  const messages = [
    '🟢 Онлайн сейчас — ответим за 15 минут',
    '👨‍💼 Юрист свободен — запишитесь прямо сейчас',
    '📞 Можете позвонить прямо сейчас',
    '⚡ Сегодня принимаем новые заявки',
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % messages.length;
    urgencyEl.style.opacity = '0';
    urgencyEl.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      urgencyEl.innerHTML = `<span class="urgency-dot" style="width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block;animation:blink 1.2s ease-in-out infinite;"></span> ${messages[idx]}`;
      urgencyEl.style.opacity = '1';
    }, 400);
  }, 5000);
})();

// ===== ACTIVE NAV LINK ON SCROLL =====
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));

  // Active nav style
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav__link.active { color: var(--accent) !important; }
  .nav__link.active::after { width: 100% !important; }`;
  document.head.appendChild(activeStyle);
})();
