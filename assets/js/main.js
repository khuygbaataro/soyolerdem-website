/* ============================================================
   СОЁЛ ЭРДЭМ — MAIN JAVASCRIPT
   Хуудасны скролл, анимаци, тоон counting эффект
   ============================================================ */

// ============================================
// Scroll-triggered fade animations
// ============================================
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Бүх карт, стат, хуудасны элементүүд дээр автоматаар ажиллах
document.addEventListener('DOMContentLoaded', () => {
  const animatedSelectors = [
    '.card', '.stat', '.program-row', '.testimonial',
    '.news-card', '.pathway-card', '.fact', '.partner-row',
    '.donor-item', '.news-item', '.platform-card',
    '.practice-card', '.curriculum-block', '.exchange-type',
    '.fade-on-scroll'
  ];

  document.querySelectorAll(animatedSelectors.join(', ')).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    fadeObserver.observe(el);
  });
});

// ============================================
// Navbar scroll effect
// ============================================
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 2px 20px rgba(26, 26, 46, 0.05)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}

// ============================================
// Stats counter animation
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const statNums = document.querySelectorAll('.stat .num, .stat-counter');

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+,?\d*)/);
        if (match) {
          const target = parseInt(match[1].replace(',', ''));
          let current = 0;
          const increment = target / 40;
          const hasPlus = text.includes('+');
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            const formatted = target >= 1000
              ? Math.floor(current).toLocaleString()
              : Math.floor(current);
            el.innerHTML = formatted + (hasPlus ? '<span class="plus">+</span>' : '');
          }, 25);
          statsObserver.unobserve(el);
        }
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => statsObserver.observe(n));
});

// ============================================
// Mobile menu toggle
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('mobile-open');
      document.body.classList.toggle('menu-open');
    });
  }
});
