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
      <a href="/" style={{'color': '#fff', 'textDecoration': 'none'}}>Volver al Inicio</a>
    </div>
  </header>

  <div className="profile-container" id="authCheck">
    <div style={{'textAlign': 'center', 'padding': '3rem'}}>
      <h3 style={{'color': 'var(--text-muted)'}}>Cargando tu perfil...</h3>
    </div>
  </div>

  <div className="profile-container" id="profileContent" style={{'display': 'none'}}>
    <div className="profile-header">
      <div>
        <h2 style={{'fontFamily': 'var(--font-heading)', 'color': 'var(--accent-gold)'}}>MI PERFIL</h2>
        <p id="userNameLabel" style={{'color': 'var(--text-muted)'}}>Hola, ...</p>
      </div>
      <button id="btnLogout" className="btn-cta" style={{'padding': '0.5rem 1rem', 'background': '#333'}}>Cerrar Sesión</button>
    </div>

    {/* Estado: No ha pagado */}
    <div id="unpaidState" className="unpaid-notice" style={{'display': 'none'}}>
      <h3 style={{'marginBottom': '1rem', 'color': '#F87171'}}>Aún no tienes acceso al curso</h3>
      <p style={{'color': 'var(--text-muted)', 'marginBottom': '1.5rem'}}>Para desbloquear los videos y el material exclusivo, necesitas completar tu inscripción.</p>
      <a href="/#checkout" className="nav-btn">Completar Pago Ahora</a>
    </div>

    {/* Estado: Pagado (Acceso Concedido) */}
    <div id="paidState" className="course-content" style={{'display': 'none'}}>
      <h3 style={{'fontFamily': 'var(--font-heading)', 'fontSize': '1.8rem', 'marginBottom': '0.5rem'}}>CASH & BRAND <span style={{'color': 'var(--accent-gold)'}}>✓ Acceso Activo</span></h3>
      <p className="course-placeholder">
        Aquí se habilitarán los videos y la información del curso próximamente.
      </p>

      <div className="video-grid" id="courseContentGrid" style={{'textAlign': 'left'}}>
        <div style={{'color': 'var(--text-muted)', 'textAlign': 'center', 'width': '100%', 'gridColumn': '1 / -1'}}>Cargando módulos...</div>
      </div>
    </div>
  </div>

  {/* Login Modal Fallback if not logged in */}
  <div className="modal-overlay" id="loginModal">
    <div className="modal-card" style={{'textAlign': 'center'}}>
      <h3 style={{'marginBottom': '1rem', 'fontFamily': 'var(--font-heading)'}}>Inicia sesión</h3>
      <p style={{'color': 'var(--text-muted)', 'marginBottom': '1.5rem'}}>Debes acceder a tu cuenta para ver tu perfil.</p>
      
      <form id="loginForm" style={{'display': 'flex', 'flexDirection': 'column', 'gap': '1rem'}}>
        <input type="email" id="loginEmail" placeholder="Correo electrónico" required style={{'padding': '0.75rem', 'borderRadius': '4px', 'border': '1px solid #ccc'}} />
        <input type="password" id="loginPassword" placeholder="Contraseña" required style={{'padding': '0.75rem', 'borderRadius': '4px', 'border': '1px solid #ccc'}} />
        <button type="submit" className="btn-cta">Entrar</button>
      </form>
    </div>
  </div>

  

    </>
  );
}
