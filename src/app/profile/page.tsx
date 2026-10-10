"use client";
import { useEffect } from 'react';
import { initAll } from '@/lib/profile-legacy';

export default function Page() {
  useEffect(() => {
    initAll();
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="/" className="brand-logo">Brian Recke<span>.</span></a>
          <a href="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#E4E4E7' }}>
            ← Volver al Inicio
          </a>
        </div>
      </header>

      <main className="profile-page-wrapper">
        {/* Estado: Cargando */}
        <div className="profile-container" id="authCheck">
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '3px solid rgba(255, 160, 0, 0.2)', 
              borderTopColor: 'var(--accent-gold)', 
              borderRadius: '50%', 
              margin: '0 auto 1.5rem auto',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cargando tu perfil...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Verificando tus credenciales y accesos...</p>
          </div>
        </div>

        {/* Contenedor Principal del Perfil */}
        <div className="profile-container" id="profileContent" style={{ display: 'none' }}>
          <div className="profile-header">
            <div className="profile-user-info">
              <div className="profile-avatar-circle">
                👤
              </div>
              <div>
                <h2 className="profile-title">MI PERFIL</h2>
                <p id="userNameLabel" className="profile-email-badge">Hola, ...</p>
              </div>
            </div>
            <button id="btnLogout" className="btn-logout" type="button">
              <span>Cerrar Sesión</span>
              <span style={{ fontSize: '0.8rem' }}>✕</span>
            </button>
          </div>

          {/* Estado: No ha pagado */}
          <div id="unpaidState" className="unpaid-notice" style={{ display: 'none' }}>
            <div className="unpaid-icon-wrap">🔒</div>
            <h3>Aún no tienes acceso al curso</h3>
            <p>Para desbloquear las clases completas, los recursos descargables y el soporte exclusivo, necesitas completar tu inscripción.</p>
            <a href="/#checkout" className="nav-btn">Completar Pago Ahora</a>
          </div>

          {/* Estado: Pagado (Acceso Concedido) */}
          <div id="paidState" className="course-content" style={{ display: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', letterSpacing: '0.04em' }}>CASH & BRAND</h3>
              <span className="course-access-tag">✓ Acceso Activo</span>
            </div>
            <p className="course-placeholder">
              Bienvenido al portal exclusivo para alumnos. A continuación encontrarás todos los módulos y materiales habilitados:
            </p>

            <div className="video-grid" id="courseContentGrid">
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem' }}>
                Cargando módulos...
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal Fallback if not logged in */}
      <div className="modal-overlay" id="loginModal">
        <div className="modal-card" style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 94, 30, 0.15)', border: '1px solid rgba(255, 94, 30, 0.35)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1.25rem auto' }}>
            🔐
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)' }}>Inicia sesión</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>Debes acceder con tu cuenta para ver tu perfil y módulos.</p>
          
          <form id="loginForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="email" id="loginEmail" placeholder="Correo electrónico" required className="input-dark" />
            <input type="password" id="loginPassword" placeholder="Contraseña" required className="input-dark" />
            <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '0.5rem' }}>Entrar al Portal</button>
          </form>
        </div>
      </div>
    </>
  );
}
