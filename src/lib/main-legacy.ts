// @ts-nocheck
import { auth, db } from './firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function initAll() {
  initHeroBadgeCounter();
  initPainCardsAnimation();
  initSpotlightEffect();
  initAnimatedCounters();
  initScrollAnimations();
  initFAQAccordion();
  initCheckoutModal();
  initCountdownTimer();
}

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

  function updateCounter(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * target);

    priceEl!.textContent = `$${currentVal.toLocaleString('en-US')}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      priceEl!.textContent = `$1,000`;
      badgeEl!.classList.add('badge-celebrate');
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
    const htmlCard = card as HTMLElement;
    htmlCard.addEventListener('mousemove', (e: any) => {
      const rect = htmlCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      htmlCard.style.setProperty('--mouse-x', `${x}px`);
      htmlCard.style.setProperty('--mouse-y', `${y}px`);
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
        const el = entry.target as HTMLElement;
        const targetVal = parseFloat(el.getAttribute('data-counter')!);
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

function animateValue(obj: HTMLElement, start: number, end: number, duration: number, prefix: string, suffix: string, decimals: number) {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
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
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = '0';
    htmlEl.style.transform = 'translateY(30px)';
    htmlEl.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const htmlEl = entry.target as HTMLElement;
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'translateY(0)';
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
      const item = header.parentElement!;
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
  const btnMercadoPago = document.getElementById('btnMercadoPago') as HTMLButtonElement;
  const btnTestMercadoPago = document.getElementById('btnTestMercadoPago') as HTMLButtonElement;
  const dolarRateLabel = document.getElementById('dolarRateLabel');
  const arsTotalLabel = document.getElementById('arsTotalLabel');
  
  const toggleAuthModeBtn = document.getElementById('toggleAuthModeBtn');
  const authNameFields = document.getElementById('authNameFields');
  const btnSubmitAuth = document.getElementById('btnSubmitAuth');
  const authName = document.getElementById('authName') as HTMLInputElement;
  const authSurname = document.getElementById('authSurname') as HTMLInputElement;

  const navProfileBtn = document.getElementById('navProfileBtn') || document.querySelector('.nav-profile-icon');
  const coursePriceUSD = 37;
  let currentArsTotal = 0;
  let isLoginMode = false;

  if (!modal) return;

  function setAuthMode(login: boolean) {
    isLoginMode = login;
    if (isLoginMode) {
      if (authNameFields) authNameFields.style.display = 'none';
      if (authName) authName.removeAttribute('required');
      if (authSurname) authSurname.removeAttribute('required');
      if (btnSubmitAuth) btnSubmitAuth.textContent = 'Iniciar Sesión';
      if (toggleAuthModeBtn) toggleAuthModeBtn.textContent = '¿No tienes cuenta? Regístrate aquí';
      const title = document.querySelector('#modalAuthState h3');
      const subtitle = document.querySelector('#modalAuthState p');
      if (title) title.textContent = 'Inicia sesión en tu cuenta';
      if (subtitle) subtitle.textContent = 'Ingresa tus credenciales para acceder a tus contenidos y perfil.';
    } else {
      if (authNameFields) authNameFields.style.display = 'flex';
      if (authName) authName.setAttribute('required', 'true');
      if (authSurname) authSurname.setAttribute('required', 'true');
      if (btnSubmitAuth) btnSubmitAuth.textContent = 'Registrarse y Continuar';
      if (toggleAuthModeBtn) toggleAuthModeBtn.textContent = '¿Ya tienes cuenta? Inicia sesión';
      const title = document.querySelector('#modalAuthState h3');
      const subtitle = document.querySelector('#modalAuthState p');
      if (title) title.textContent = 'Crea tu cuenta para acceder';
      if (subtitle) subtitle.textContent = 'Necesitas registrarte antes de proceder al pago.';
    }
  }

  // Navbar Profile Button: Open login modal if not logged in, or redirect to profile if logged in
  if (navProfileBtn) {
    navProfileBtn.addEventListener('click', (e) => {
      if (auth.currentUser) {
        window.location.href = '/profile';
      } else {
        e.preventDefault();
        modal.classList.add('active');
        setAuthMode(true);
        showAuthState();
      }
    });
  }

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (auth.currentUser) {
        showPaymentState();
      } else {
        setAuthMode(false);
        showAuthState();
      }
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
      currentArsTotal = rate * coursePriceUSD;
      if(dolarRateLabel) dolarRateLabel.textContent = `$${rate.toLocaleString('es-AR')} ARS`;
      if(arsTotalLabel) arsTotalLabel.textContent = `$${currentArsTotal.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ARS`;
    } catch (err) {
      console.error('Error al obtener dolar:', err);
      if(dolarRateLabel) dolarRateLabel.textContent = 'Error';
      if(arsTotalLabel) arsTotalLabel.textContent = 'Error';
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
    if(authState) authState.style.display = 'block';
    if(paymentState) paymentState.style.display = 'none';
  }

  function showPaymentState() {
    if(authState) authState.style.display = 'none';
    if(paymentState) paymentState.style.display = 'block';
    fetchDolarRate();
  }

  if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', () => {
      setAuthMode(!isLoginMode);
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('authEmail') as HTMLInputElement).value;
      const password = (document.getElementById('authPassword') as HTMLInputElement).value;

      try {
        if (isLoginMode) {
          // INICIO DE SESIÓN
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Si el alumno ya pagó y tiene acceso activo, redirigir directo a su portal
          try {
            const userDoc = await getDoc(doc(db, "profiles", user.uid));
            if (userDoc.exists() && userDoc.data()?.has_paid) {
              window.location.href = '/profile';
              return;
            }
          } catch (docErr) {
            console.warn('Error verificando estado del perfil:', docErr);
          }

          showPaymentState();
        } else {
          // REGISTRO
          const name = authName.value;
          const surname = authSurname.value;
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
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Este correo ya está registrado. Por favor, haz clic en "Inicia sesión" abajo.');
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          alert('Correo o contraseña incorrectos.');
        } else {
          alert('Error: ' + error.message);
        }
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
        
      } catch (error: any) {
        alert('Error con Google: ' + error.message);
      }
    });
  }

  async function handleMercadoPagoClick(amount: number, isTest = false) {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Debes iniciar sesión primero.');
        return;
      }
      
      const title = isTest ? 'Pago de Prueba (CASH & BRAND)' : 'Workshop CASH & BRAND';
      const originalText = isTest ? btnTestMercadoPago.innerHTML : btnMercadoPago.innerHTML;
      
      const buttonEl = isTest ? btnTestMercadoPago : btnMercadoPago;
      buttonEl.innerHTML = '⏳ Procesando...';
      buttonEl.disabled = true;

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, unit_price: amount, uid: user.uid })
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al generar el link de pago.');
        buttonEl.innerHTML = originalText;
        buttonEl.disabled = false;
      }
    } catch (error) {
      console.error('Error MP:', error);
      alert('Error de conexión con Mercado Pago.');
    }
  }

  if (btnMercadoPago) {
    btnMercadoPago.addEventListener('click', () => {
      handleMercadoPagoClick(currentArsTotal, false);
    });
  }

  if (btnTestMercadoPago) {
    btnTestMercadoPago.addEventListener('click', () => {
      handleMercadoPagoClick(1, true);
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

