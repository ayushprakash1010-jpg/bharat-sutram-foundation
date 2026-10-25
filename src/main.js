/**
 * Bharat Sutram Foundation — Shared JavaScript
 * Navigation, scroll animations, accordion, form validation
 */

// ---------- Navigation ----------
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__mobile-toggle');
  const links = document.querySelector('.nav__links');

  if (!nav) return;

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}

// ---------- Scroll Animations ----------
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

// ---------- Accordion ----------
function initAccordions() {
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const content = item.querySelector('.accordion__content');
      const isActive = item.classList.contains('active');

      // Close all siblings
      const accordion = item.closest('.accordion');
      accordion.querySelectorAll('.accordion__item').forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('active');
          sibling.querySelector('.accordion__content').style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// ---------- Form Validation ----------
function initFormValidation() {
  const forms = document.querySelectorAll('[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          group.classList.add('form-group--error');
          isValid = false;
        } else {
          group.classList.remove('form-group--error');
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            group.classList.add('form-group--error');
            isValid = false;
          }
        }
      });

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        const action = form.getAttribute('action') || 'https://formsubmit.co/ayushprakash1010@gmail.com';
        const ajaxUrl = action.includes('/ajax/') ? action : action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        const formData = new FormData(form);

        fetch(ajaxUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          const successMsg = form.querySelector('.form-success');
          if (successMsg) {
            if (data.success === 'true' || data.success === true) {
              successMsg.innerHTML = '<strong>Thank you for your enquiry!</strong><br>Your message has been received. We aim to respond within a reasonable timeframe.';
            } else {
              successMsg.innerHTML = '<strong>' + (data.message || 'Thank you! Your message was submitted successfully.') + '</strong>';
            }
            successMsg.style.display = 'block';
            form.reset();
            setTimeout(() => {
              successMsg.style.display = 'none';
            }, 8000);
          }
        })
        .catch(() => {
          // Fallback to normal form submit if fetch fails
          form.submit();
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
      }
    });

    // Remove error on input
    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('form-group--error');
      });
    });
  });
}

// ---------- Smooth counter animation ----------
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'));
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }, 30);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

// ---------- Initialize everything ----------
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initAccordions();
  initFormValidation();
  initCounters();
});

export { initNavigation, initScrollAnimations, initAccordions, initFormValidation, initCounters };
