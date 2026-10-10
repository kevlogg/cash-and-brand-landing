import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// CASH & BRAND Interactive Engine
document.addEventListener('DOMContentLoaded', () => {
  initHeroBadgeCounter();
  initPainCardsAnimation();
  initSpotlightEffect();
  initAnimatedCounters();
  initScrollAnimations();
  initFAQAccordion();
  initCheckoutModal();
  initCountdownTimer();
});

// Pain Cards Staggered Reveal Entrance Animation
function initPainCardsAnimation() {
  const painCards = document.querySelectorAll('.pain-card');
  if (!painCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        painCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('pain-animated');
          }, index * 90); // 90ms staggered entrance per card
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const painContainer = document.querySelector('.pain-container');
  if (painContainer) {
    observer.observe(painContainer);
  }
}

// 0. Hero Badge Dynamic Counter & Burst Celebration
function initHeroBadgeCounter() {
  const badgeEl = document.getElementById('heroBadge');
  const priceEl = document.getElementById('heroBadgePrice');
  if (!badgeEl || !priceEl) return;

  const target = 1000;
  const duration = 1800; // 1.8 seconds count up
  const startTime = performance.now();

  function updateCounter(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * target);

    priceEl.textContent = `$${currentVal.toLocaleString('en-US')}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      priceEl.textContent = `$1,000`;
      badgeEl.classList.add('badge-celebrate');
    }
  }

  // Slight delay before counting starts for impact
  setTimeout(() => {
    requestAnimationFrame(updateCounter);
  }, 400);
}

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
  const ctaButtons = document.querySelectorAll('.btn-checkout-trigger');
  const modal = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const authState = document.getElementById('modalAuthState');
  const paymentState = document.getElementById('modalPaymentState');
  const authForm = document.getElementById('authForm');
  const btnGoogleAuth = document.getElementById('btnGoogleAuth');
  const btnMercadoPago = document.getElementById('btnMercadoPago');
  const dolarRateLabel = document.getElementById('dolarRateLabel');
  const arsTotalLabel = document.getElementById('arsTotalLabel');

  const coursePriceUSD = 37;

  if (!modal) return;

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      checkUserSession();
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

  async function fetchDolarRate() {
    try {
      const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
      const data = await response.json();
      const rate = data.venta;
      const totalArs = rate * coursePriceUSD;
      dolarRateLabel.textContent = `$${rate.toLocaleString('es-AR')} ARS`;
      arsTotalLabel.textContent = `$${totalArs.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ARS`;
    } catch (err) {
      console.error('Error al obtener dolar:', err);
      dolarRateLabel.textContent = 'Error';
      arsTotalLabel.textContent = 'Error';
    }
  }

  function checkUserSession() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        showPaymentState();
      } else {
        showAuthState();
      }
    });
  }

  function showAuthState() {
    authState.style.display = 'block';
    paymentState.style.display = 'none';
  }

  function showPaymentState() {
    authState.style.display = 'none';
    paymentState.style.display = 'block';
    fetchDolarRate();
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('authName').value;
      const surname = document.getElementById('authSurname').value;
      const email = document.getElementById('authEmail').value;
      const password = document.getElementById('authPassword').value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save to Firestore
        await setDoc(doc(db, "profiles", user.uid), {
          name: name,
          surname: surname,
          email: email,
          created_at: new Date().toISOString(),
          has_paid: false
        });

        showPaymentState();
      } catch (error) {
        alert('Error en registro: ' + error.message);
      }
    });
  }

  if (btnGoogleAuth) {
    btnGoogleAuth.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if user profile exists, if not create one
        const userDocRef = doc(db, "profiles", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          const names = user.displayName ? user.displayName.split(' ') : [''];
          await setDoc(userDocRef, {
            name: names[0] || '',
            surname: names.slice(1).join(' ') || '',
            email: user.email,
            created_at: new Date().toISOString(),
            has_paid: false
          });
        }
        
      } catch (error) {
        alert('Error con Google: ' + error.message);
      }
    });
  }

  if (btnMercadoPago) {
    btnMercadoPago.addEventListener('click', () => {
      alert('Redirigiendo a Mercado Pago para abonar en ARS...');
      // Integration of Mercado Pago SDK or Checkout Pro would go here.
    });
  }
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
