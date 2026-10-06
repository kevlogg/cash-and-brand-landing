// CASH & BRAND Interactive Engine

document.addEventListener('DOMContentLoaded', () => {
  initSpotlightEffect();
  initAnimatedCounters();
  initScrollAnimations();
  initFAQAccordion();
  initCheckoutModal();
  initCountdownTimer();
});

// 1. Spotlight Radial Glow Effect on Module Cards
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.bento-card, .metric-card, .pain-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// 2. Numerical Counter Animation for Metrics
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-counter'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        
        animateValue(el, 0, targetVal, 2000, prefix, suffix, decimals);
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

function animateValue(obj, start, end, duration, prefix, suffix, decimals) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Ease out expo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentVal = start + (end - start) * easeProgress;
    
    let formattedVal = currentVal.toLocaleString('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    obj.innerHTML = `${prefix}${formattedVal}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// 3. Scroll Reveal Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.bento-card, .pain-card, .metric-card, .quote-block, .story-grid, .bonus-card');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => observer.observe(el));
}

// 4. FAQ Accordion Toggle
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// 5. Checkout Modal Handler
function initCheckoutModal() {
  const ctaButtons = document.querySelectorAll('.btn-cta, .btn-checkout-trigger');
  const modal = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal) return;

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's a link pointing to #checkout or modal trigger
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// 6. Countdown Urgency Timer
function initCountdownTimer() {
  const timerElement = document.getElementById('offerTimer');
  if (!timerElement) return;

  let totalSeconds = 15 * 60; // 15 minutes

  const updateTimer = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMins = String(minutes).padStart(2, '0');
    const formattedSecs = String(seconds).padStart(2, '0');

    timerElement.textContent = `${formattedMins}:${formattedSecs}`;

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      totalSeconds = 15 * 60; // loop timer for live demo
    }
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}
