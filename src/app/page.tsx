"use client";
import { useEffect } from 'react';
import { initAll } from '@/lib/main-legacy';

export default function Home() {
  useEffect(() => {
    initAll();
  }, []);

  return (
    <>
      

  {/* 1. HEADER / NAVBAR */}
  <header className="navbar">
    <div className="container navbar-inner">
      <a href="#" className="brand-logo">
        Brian Recke<span>.</span>
      </a>
      <ul className="nav-links">
        <li><a href="#dolores" className="nav-link">¿Te Pasa Esto?</a></li>
        <li><a href="#resultados" className="nav-link">Resultados</a></li>
        <li><a href="#programa" className="nav-link">Programa</a></li>
        <li><a href="#sobre-brian" className="nav-link">Sobre Brian</a></li>
        <li><a href="#faq" className="nav-link">FAQ</a></li>
      </ul>
      <a href="/profile" className="nav-profile-icon" title="Mi Perfil">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </a>
    </div>
  </header>

  <main>
    {/* 2. HERO SECTION */}
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="badge badge-hero-animated" id="heroBadge">
          🔥 De $0 a <span id="heroBadgePrice" className="badge-price-num">$0</span> en 30 días
        </div>
        
        <h1 className="hero-title">
          APRENDÉ A <span className="highlight-accent">VENDER ONLINE</span> DE FORMA <span className="highlight-accent">CONSTANTE</span>
        </h1>

        <p className="hero-deliverables">
          Workshop + comunidad privada + Recursos gratis 🎁
        </p>

        <p className="hero-objections">
          <span>Sin necesitar ser experto en marketing.</span>
          <span>Sin miles de seguidores.</span>
        </p>

        {/* Bloque de Oferta y Precio */}
        <div className="hero-pricing-box">
          <p className="price-strikethrough">Antes $77 USD</p>
          <div className="price-main">
            $37 USD
            <span className="price-badge-discount">52% OFF</span>
          </div>
          <div style={{'marginTop': '1.5rem'}}>
            <a href="#checkout" className="btn-cta btn-cta-lg btn-cta-pulse btn-checkout-trigger" style={{'width': '100%'}}>
              EMPEZÁ HOY!
            </a>
          </div>
          <div className="spots-left-indicator">
            <span className="spots-dot"></span>
            Últimos cupos promocionales disponibles con precio de lanzamiento
          </div>
        </div>

        {/* Mockup Visual Premium */}
        <div className="hero-mockup-wrapper">
          <img src="./images/brian1.png" alt="CASH & BRAND Brian Recke" className="hero-mockup-img" loading="eager" />
        </div>
      </div>
    </section>

    {/* 3. SECCIÓN DE DOLORES: "SEAMOS HONESTOS 🔥" */}
    <section className="pain-section" id="dolores">
      <div className="container">
        <div className="pain-container">
          <div className="section-header" style={{'marginBottom': '2rem'}}>
            <h2 className="section-title">SEAMOS HONESTOS 🔥</h2>
            <p className="section-subtitle">Si estás sintiendo que tu esfuerzo en redes no se traduce en clientes reales, prestá atención a esto:</p>
          </div>

          <div className="pain-list">
            <div className="pain-card">
              <div className="pain-icon">✕</div>
              <div className="pain-text">
                Seguís consejos de gurús de internet pero ninguno funciona en tu rubro.
              </div>
            </div>

            <div className="pain-card">
              <div className="pain-icon">✕</div>
              <div className="pain-text">
                Subís fotos y reels de tu producto o servicio y nadie pregunta nada.
              </div>
            </div>

            <div className="pain-card">
              <div className="pain-icon">✕</div>
              <div className="pain-text">
                Ves que otros en tu mismo rubro venden más - y no entendés por qué.
              </div>
            </div>

            <div className="pain-card">
              <div className="pain-icon">✕</div>
              <div className="pain-text">
                Improvisás qué publicar cada día sin saber si eso te acerca a una venta.
              </div>
            </div>

            <div className="pain-card">
              <div className="pain-icon">✕</div>
              <div className="pain-text">
                Invertís tiempo y energía en contenido que no te genera ni un cliente.
              </div>
            </div>

            <div className="pain-card pain-card-frustrating">
              <div className="pain-icon">💥</div>
              <div className="pain-text">
                <strong>Y lo más frustrante:</strong> Sentís que hacés todo lo que te dicen - y las ventas siguen sin llegar porque nadie te enseñó a ordenar el camino desde que alguien te ve hasta que te compra.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 4. SECCIÓN DE TRANSFORMACIÓN Y CASO DE ÉXITO */}
    <section className="transformation-section" id="resultados">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">PERO, ¿QUÉ PASA SI PODEMOS CAMBIAR ESTO RÁPIDO?</h2>
          <p className="section-subtitle">Estos son los resultados de un cliente, sólo subiendo reels e historias.</p>
        </div>

        {/* Testimonio Destacado (Cita tipo revista) */}
        <div className="quote-block">
          <div className="quote-mark">“</div>
          <p className="quote-text">
            "Antes publicaba 3 Reels por semana y no pasaba nada, nadie me hablaba. Ahora publico los mismos Reels por semana cambiando la idea y ya generamos más de 20.000 seguidores. Estoy feliz con tu trabajo colo."
          </p>
          <div className="quote-author">
            <div className="quote-author-avatar">CC</div>
            <div className="quote-author-info">
              <h4>Cliente de Asesoría CASH & BRAND</h4>
              <p>Caso de éxito verificado • Crecimiento orgánico</p>
            </div>
          </div>
        </div>

        {/* Panel de Resultados / Métricas (Simulación de estadísticas Instagram) */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card-header">
              <span>Visualizaciones Totales</span>
              <div className="metric-icon">👁</div>
            </div>
            <div className="metric-value" data-counter="42254" data-decimals="0">0</div>
            <div className="metric-growth">
              <span>▲ +148% vs mes anterior</span>
            </div>
            {/* Dynamic Mini SVG Graphic */}
            <svg className="metric-chart-sim" viewBox="0 0 200 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,45 Q40,30 80,38 T160,15 T200,5 L200,50 L0,50 Z" fill="rgba(255, 94, 30, 0.15)" />
              <path d="M0,45 Q40,30 80,38 T160,15 T200,5" fill="none" stroke="#FF5E1E" strokeWidth="3" />
            </svg>
          </div>

          <div className="metric-card">
            <div className="metric-card-header">
              <span>Cuentas Alcanzadas</span>
              <div className="metric-icon">📊</div>
            </div>
            <div className="metric-value" data-counter="20.7" data-prefix="+" data-suffix="%" data-decimals="1">+0%</div>
            <div className="metric-growth">
              <span>▲ Alcance de alta conversión</span>
            </div>
            <svg className="metric-chart-sim" viewBox="0 0 200 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,40 Q50,42 100,20 T200,8 L200,50 L0,50 Z" fill="rgba(255, 160, 0, 0.15)" />
              <path d="M0,40 Q50,42 100,20 T200,8" fill="none" stroke="#FFA000" strokeWidth="3" />
            </svg>
          </div>

          <div className="metric-card">
            <div className="metric-card-header">
              <span>Nuevos Seguidores Cualificados</span>
              <div className="metric-icon">👥</div>
            </div>
            <div className="metric-value" data-counter="20000" data-prefix="+" data-decimals="0">+0</div>
            <div className="metric-growth">
              <span>★ Audiencia de compradores de Bs. As. y provincias</span>
            </div>
            <svg className="metric-chart-sim" viewBox="0 0 200 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,48 Q40,40 90,25 T180,10 T200,2 L200,50 L0,50 Z" fill="rgba(16, 185, 129, 0.15)" />
              <path d="M0,48 Q40,40 90,25 T180,10 T200,2" fill="none" stroke="#10B981" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    {/* 5. SECCIÓN DE PROGRAMA: "CASH & BRAND" */}
    <section className="program-section" id="programa">
      <div className="container">
        <div className="section-header" style={{'marginBottom': '1rem'}}>
          <h2 className="section-title" style={{'fontSize': '2.2rem'}}>Te doy la bienvenida a... <span className="highlight-accent">CASH & BRAND</span></h2>
          <p className="section-subtitle" style={{'marginTop': '0.35rem', 'maxWidth': '900px', 'fontSize': '0.95rem', 'color': 'var(--text-secondary)', 'lineHeight': '1.4'}}>
            Mi estrategia paso a paso, para crear una marca personal que atraiga nuevas personas, construya una comunidad sólida y forme una audiencia de compradores lista para tus productos o servicios, comenzando con tus primeros $1,000 en 30 días.
          </p>
        </div>

        <div style={{'textAlign': 'center', 'marginBottom': '1rem'}}>
          <h3 style={{'fontSize': '1.5rem', 'fontFamily': 'var(--font-heading)', 'color': 'var(--text-primary)'}}>
            ESTO VAS A APRENDER EN CASH & BRAND
          </h3>
        </div>

        {/* Bento Grid de 7 Módulos */}
        <div className="bento-grid">
          
          {/* Módulo 1 */}
          <div className="bento-card">
            <div className="bento-card-header">
              <span className="bento-module-num">MÓDULO 1</span>
            </div>
            <h4 className="bento-card-title">SENTANDO LAS BASES</h4>
            <p className="bento-card-desc">
              Definí tu seguidor ideal y optimizá tu perfil para crecer.
            </p>
          </div>

          {/* Módulo 2 */}
          <div className="bento-card">
            <div className="bento-card-header">
              <span className="bento-module-num">MÓDULO 2</span>
            </div>
            <h4 className="bento-card-title">IDEAS ILIMITADAS</h4>
            <p className="bento-card-desc">
              Descubrí herramientas y procesos para nunca quedarte sin contenido.
            </p>
          </div>

          {/* Módulo 3 */}
          <div className="bento-card">
            <div className="bento-card-header">
              <span className="bento-module-num">MÓDULO 3</span>
            </div>
            <h4 className="bento-card-title">DE SEGUIDOR A CLIENTE</h4>
            <p className="bento-card-desc">
              Los 3 tipos de contenido que convierten views en seguidores y ventas.
            </p>
          </div>

          {/* Módulo 4 */}
          <div className="bento-card">
            <div className="bento-card-header">
              <span className="bento-module-num">MÓDULO 4</span>
            </div>
            <h4 className="bento-card-title">SISTEMA DE CREACIÓN</h4>
            <p className="bento-card-desc">
              Plantilla de producción para dejar de improvisar y publicar con claridad.
            </p>
          </div>

          {/* Módulo 5 */}
          <div className="bento-card">
            <div className="bento-card-header">
              <span className="bento-module-num">MÓDULO 5</span>
            </div>
            <h4 className="bento-card-title">GUIONIZAR Y COPYWRITING</h4>
            <p className="bento-card-desc">
              La fórmula para crear guiones virales en minutos.
            </p>
          </div>

          {/* Módulo 6 */}
          <div className="bento-card">
            <div className="bento-card-header">
              <span className="bento-module-num">MÓDULO 6</span>
            </div>
            <h4 className="bento-card-title">GRABACIÓN Y EDICIÓN</h4>
            <p className="bento-card-desc">
              Cómo grabar y editar contenido atractivo con tutoriales paso a paso (sin necesidad de equipo profesional).
            </p>
          </div>

          {/* Módulo 7 (Featured AI Module Card - Full Width 3 Columns) */}
          <div className="bento-card bento-card-wide bento-card-featured">
            <div className="bento-card-header">
              <span className="bento-module-num" style={{'background': 'rgba(255, 160, 0, 0.2)', 'borderColor': 'rgba(255, 160, 0, 0.5)', 'color': 'var(--accent-gold)'}}>MÓDULO 7 • EXCLUSIVO IA</span>
            </div>
            <h4 className="bento-card-title" style={{'fontSize': '1.55rem'}}>GPT CASH & BRAND</h4>
            <p className="bento-card-desc" style={{'fontSize': '1rem', 'color': 'var(--text-secondary)', 'maxWidth': '850px'}}>
              Cómo crear un sistema automatizado para generar ganchos magnéticos, copys persuasivos y guiones virales ilimitados utilizando Inteligencia Artificial.
            </p>
          </div>

        </div>
      </div>
    </section>

    {/* 6. BARRA DE OFERTA INTERMEDIA (CINTA DE CONVERSIÓN) */}
    <section className="ribbon-section">
      <div className="container">
        <div className="ribbon-card">
          <div className="ribbon-info">
            <h3>¡OPORTUNIDAD DE ACCESO INMEDIATO!</h3>
            <p>Empiezá hoy a transformar tu marca y generar tus primeros $1,000 en 30 días.</p>
          </div>

          <div className="ribbon-price-tag">
            <div className="ribbon-price-box">
              <span className="ribbon-old-price">Antes $77 USD</span>
              <div className="ribbon-new-price">$37 USD</div>
            </div>
            <a href="#checkout" className="btn-cta btn-dark btn-checkout-trigger">
              EMPEZÁ HOY!
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* 7. SECCIÓN DE AUTORIDAD Y STORYTELLING */}
    <section className="story-section" id="sobre-brian">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">¿QUIÉN SOY Y POR QUÉ TE PUEDO AYUDAR?</h2>
        </div>

        <div className="story-grid">
          {/* Columna 1: Retrato Brian Recke */}
          <div className="story-photo-wrapper">
            <img src="./images/brian2.jpeg" alt="Brian Recke" className="story-img" />
            <div className="story-floating-badge">
              <div style={{'color': 'var(--accent-gold)', 'fontSize': '1.1rem', 'marginBottom': '0.2rem'}}>Brian Recke</div>
              <div>Creador de CASH & BRAND</div>
            </div>
          </div>

          {/* Columna 2: Historia Personal */}
          <div className="story-content">
            <p className="story-content-p">
              Soy Brian Recke. Fui obrero, soldado, policía, vendedor callejero y fundí con mi primer kiosco. Sí, un montón con 27 años hasta ese momento.
            </p>

            <p className="story-content-p">
              En 2019 me fui a Bariloche con más de 3 millones de pesos <strong className="text-orange">PERO EN NEGATIVO O SEA EN DEUDA</strong>, con una familia a cargo.
            </p>

            <p className="story-content-p">
              Así todo lo bueno no llegaba, vendí panes, vendí helados en la playa, corté el pasto y empecé de cero.
            </p>

            <div className="story-highlight-box">
              Pero un año después cambié la cabeza y después de abrir un food truck, creé ReckeBar (mi primer negocio exitoso), después otro restaurante y varios locales más. Así, después de unos cuantos dólares en cursos y capacitaciones, aprendí a invertir y vivir de mis propios negocios.
            </div>

            <p className="story-content-p">
              Hoy quiero ayudarte a vos, que estás trabado o frustrado/a, a construir un camino claro, real y rentable.
            </p>

            <p className="story-content-p">
              No te prometo fórmulas mágicas. Te muestro lo que a mí me funcionó, cómo podés lograr lo mismo o más, y así llegar a tener una marca personal que te cambie la vida.
            </p>

            <p className="story-content-p" style={{'fontWeight': '700', 'color': 'var(--text-primary)'}}>
              Esto no es motivación vacía ni teoría complicada. Te voy a mostrar cómo podés transformar tu realidad paso a paso, con lo que tenés o sabés hoy.
            </p>

            <div style={{'marginTop': '2rem', 'textAlign': 'center'}}>
              <a href="#checkout" className="btn-cta btn-cta-lg btn-checkout-trigger">
                ¿EMPEZAMOS?
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>



    {/* FAQ SECTION */}
    <section id="faq">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">¿TENÉS DUDAS? RESPONDEMOS TODO</h2>
        </div>

        <div className="faq-accordion">
          <div className="faq-item active">
            <div className="faq-header">
              <h4>¿Cómo y cuándo recibo el acceso al workshop y material?</h4>
              <span className="faq-icon">▼</span>
            </div>
            <div className="faq-body">
              El acceso es inmediato e instantáneo. Apenas completás la compra por $37 USD, recibís un correo electrónico con tus credenciales de acceso a la plataforma privada, la comunidad y todas las plantillas.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-header">
              <h4>¿Necesito tener experiencia previa o equipo profesional?</h4>
              <span className="faq-icon">▼</span>
            </div>
            <div className="faq-body">
              No. El programa está diseñado para ejecutarse únicamente con tu teléfono celular actual. Te enseñamos a grabar con luz natural, encuadres sencillos y editar rápido con apps gratuitas.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-header">
              <h4>¿Funciona si tengo pocos seguidores o empiezo de cero?</h4>
              <span className="faq-icon">▼</span>
            </div>
            <div className="faq-body">
              Totalmente. CASH & BRAND no se enfoca en métricas vanidosas, sino en atraer compradores reales. No necesitás 100k seguidores para facturar tus primeros $1,000 USD online.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-header">
              <h4>¿Qué medios de pago están disponibles?</h4>
              <span className="faq-icon">▼</span>
            </div>
            <div className="faq-body">
              Podés pagar con Tarjeta de Crédito, Débito, MercadoPago (en pesos argentinos) o PayPal para el resto del mundo.
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  {/* FOOTER */}
  <footer className="footer">
    <div className="container">
      <div className="footer-brand">
        Brian Recke<span style={{'color': 'var(--accent-orange)'}}>.</span>
      </div>

      <ul className="footer-links">
        <li><a href="#hero">Inicio</a></li>
        <li><a href="#programa">Programa</a></li>
        <li><a href="#sobre-brian">Sobre Brian</a></li>
        <li><a href="#checkout" className="btn-checkout-trigger">Inscribirme ($37 USD)</a></li>
      </ul>



      <p className="footer-copy">
        © 2026 Brian Recke • CASH & BRAND. Todos los derechos reservados.
      </p>
    </div>
  </footer>

  {/* CHECKOUT MODAL INTERACTIVO (Auth & Pago) */}
  <div className="modal-overlay" id="checkoutModal">
    <div className="modal-card">
      <button className="modal-close" id="modalCloseBtn">✕</button>
      
      {/* ESTADO 1: AUTENTICACIÓN (Registro / Login) */}
      <div id="modalAuthState">
        <div style={{'textAlign': 'center', 'marginBottom': '1.5rem'}}>
          <h3 style={{'fontSize': '1.8rem', 'fontFamily': 'var(--font-heading)', 'color': 'var(--text-primary)'}}>
            Crea tu cuenta para acceder
          </h3>
          <p style={{'color': 'var(--text-muted)', 'fontSize': '0.95rem'}}>
            Necesitas registrarte antes de proceder al pago.
          </p>
        </div>
        
        <form id="authForm" style={{'display': 'flex', 'flexDirection': 'column', 'gap': '0.85rem', 'marginBottom': '1.25rem'}}>
          <div id="authNameFields" style={{'display': 'flex', 'gap': '0.75rem'}}>
            <input type="text" id="authName" placeholder="Nombre" required className="input-dark" />
            <input type="text" id="authSurname" placeholder="Apellido" required className="input-dark" />
          </div>
          <input type="email" id="authEmail" placeholder="Correo electrónico" required className="input-dark" />
          <input type="password" id="authPassword" placeholder="Contraseña" required className="input-dark" />
          
          <button id="btnSubmitAuth" type="submit" className="btn-cta" style={{'width': '100%', 'fontSize': '1.05rem', 'padding': '0.85rem'}}>
            Registrarse y Continuar
          </button>
        </form>

        <div style={{'textAlign': 'center', 'marginBottom': '1rem'}}>
          <button type="button" id="toggleAuthModeBtn" style={{'background': 'none', 'border': 'none', 'color': 'var(--accent-orange)', 'textDecoration': 'underline', 'cursor': 'pointer', 'fontSize': '0.92rem'}}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>

        <div style={{'display': 'none', 'textAlign': 'center', 'marginBottom': '1rem', 'color': 'var(--text-muted)', 'fontSize': '0.9rem'}}>
          O
        </div>

        <button id="btnGoogleAuth" className="btn-cta" style={{'display': 'none', 'width': '100%', 'background': '#fff', 'color': '#333', 'border': '1px solid #ccc', 'boxShadow': 'none', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '0.5rem', 'marginBottom': '1rem'}}>
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          Continuar con Google
        </button>
      </div>

      {/* ESTADO 2: PAGO (Mercado Pago y Dólar Oficial) */}
      <div id="modalPaymentState" style={{'display': 'none'}}>
        <div style={{'textAlign': 'center', 'marginBottom': '1.25rem'}}>
          <div className="badge badge-gold" style={{'marginBottom': '0.35rem'}}>
            ⏳ Oferta por Tiempo Limitado
          </div>
          <h3 style={{'fontSize': '1.75rem', 'fontFamily': 'var(--font-heading)', 'color': 'var(--text-primary)', 'letterSpacing': '0.03em', 'lineHeight': '1.1'}}>
            INSCRIPCIÓN A CASH & BRAND
          </h3>
          <p style={{'color': 'var(--text-muted)', 'fontSize': '0.88rem', 'marginTop': '0.25rem'}}>
            Tu oferta especial vence en: <strong id="offerTimer" style={{'color': 'var(--accent-orange)', 'fontSize': '1.05rem'}}>15:00</strong>
          </p>
        </div>

        <div className="modal-pricing-box">
          <div style={{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': '0.4rem', 'gap': '0.5rem'}}>
            <span style={{'fontWeight': '700', 'color': 'var(--text-primary)', 'fontSize': '0.92rem'}}>Workshop CASH & BRAND + Bonus</span>
            <span style={{'textDecoration': 'line-through', 'color': 'var(--text-muted)', 'fontSize': '0.88rem', 'whiteSpace': 'nowrap'}}>$77 USD</span>
          </div>
          <div style={{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'gap': '0.5rem'}}>
            <span style={{'fontWeight': '800', 'color': 'var(--accent-gold)', 'fontSize': '1.05rem'}}>Descuento Exclusivo</span>
            <span style={{'fontFamily': 'var(--font-heading)', 'fontSize': '2rem', 'fontWeight': '900', 'color': 'var(--text-primary)', 'whiteSpace': 'nowrap'}}>$37 USD</span>
          </div>
          <div style={{'marginTop': '0.85rem', 'borderTop': '1px dashed rgba(255, 94, 30, 0.3)', 'paddingTop': '0.85rem', 'textAlign': 'center'}}>
            <p style={{'fontSize': '0.85rem', 'color': 'var(--text-muted)', 'marginBottom': '0.3rem'}}>Cotización Dólar Oficial actual: <strong id="dolarRateLabel">Cargando...</strong></p>
            <p style={{'fontSize': '1.15rem', 'fontWeight': 'bold', 'color': 'var(--text-primary)'}}>Total a pagar: <span id="arsTotalLabel" style={{'color': '#009EE3', 'display': 'inline-block', 'marginTop': '0.15rem'}}>Cargando...</span></p>
          </div>
        </div>

        <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '0.75rem', 'marginBottom': '1.25rem'}}>
          <button id="btnMercadoPago" className="btn-mercadopago" type="button">
            <span>💳</span>
            <span>PAGAR CON MERCADO PAGO</span>
          </button>
          
          <button id="btnTestMercadoPago" className="btn-mp-test" type="button">
            <span>🔬</span>
            <span>Pago de Prueba ($1 ARS)</span>
          </button>
        </div>
      </div>

      <div style={{'textAlign': 'center', 'fontSize': '0.82rem', 'color': 'var(--text-muted)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '0.4rem', 'marginTop': '0.5rem'}}>
        <span>🛡️ Pago 100% Encriptado y Seguro</span>
      </div>
    </div>
  </div>

  

    </>
  );
}
