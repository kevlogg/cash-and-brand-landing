"use client";
import { useEffect } from 'react';
import { initAll } from '@/lib/admin-legacy';

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

      <main className="admin-page-wrapper">
        <div className="admin-container">
          {/* Admin Header */}
          <div className="admin-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', letterSpacing: '0.04em', lineHeight: '1.1' }}>
                  Panel Super Admin
                </h2>
                <span className="badge badge-gold" style={{ margin: 0, padding: '0.25rem 0.75rem', fontSize: '0.78rem' }}>
                  🛡️ ACCESO MAESTRO
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Gestión en tiempo real de alumnos, accesos y módulos de CASH & BRAND
              </p>
            </div>
            <button id="btnLogout" className="btn-logout" type="button" style={{ display: 'none' }}>
              <span>Cerrar Sesión</span>
              <span style={{ fontSize: '0.8rem' }}>✕</span>
            </button>
          </div>

          {/* Login Admin State */}
          <div id="adminLoginState" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 160, 0, 0.15)', border: '1.5px solid rgba(255, 160, 0, 0.4)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1.25rem auto' }}>
              🛡️
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Acceso Administrador
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Ingresa con tus credenciales autorizadas
            </p>

            <form id="adminLoginForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Correo electrónico</label>
                <input type="email" id="adminEmail" placeholder="ej: loggia.1996@gmail.com" required className="input-dark" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Contraseña</label>
                <input type="password" id="adminPassword" placeholder="••••••••" required className="input-dark" />
              </div>
              <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '0.5rem' }}>Entrar al Panel</button>
            </form>
          </div>

          {/* Admin Dashboard State */}
          <div id="adminDashboardState" style={{ display: 'none' }}>
            
            {/* KPI Cards Summary */}
            <div className="admin-kpis-grid">
              <div className="admin-kpi-card">
                <span className="admin-kpi-val" id="statTotalUsers" style={{ color: '#FFFFFF' }}>0</span>
                <span className="admin-kpi-lbl">👥 Total Alumnos</span>
              </div>
              <div className="admin-kpi-card">
                <span className="admin-kpi-val" id="statPaidUsers" style={{ color: '#10B981' }}>0</span>
                <span className="admin-kpi-lbl">✓ Acceso Activo (Pagados)</span>
              </div>
              <div className="admin-kpi-card">
                <span className="admin-kpi-val" id="statUnpaidUsers" style={{ color: '#FFA000' }}>0</span>
                <span className="admin-kpi-lbl">⏳ Pendientes de Pago</span>
              </div>
            </div>

            {/* Mobile-Friendly Tabs Switcher */}
            <div className="admin-tabs">
              <button type="button" id="tabBtnUsers" className="admin-tab-btn active">
                <span>👥 Alumnos</span>
                <span id="usersCountBadge" className="admin-tab-count">0</span>
              </button>
              <button type="button" id="tabBtnResources" className="admin-tab-btn">
                <span>📚 Contenido</span>
                <span id="resCountBadge" className="admin-tab-count">0</span>
              </button>
            </div>

            {/* TAB 1: ALUMNOS REGISTRADOS */}
            <div id="tabUsersContent">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--accent-gold)', letterSpacing: '0.03em' }}>
                  Alumnos Registrados
                </h3>
                <input 
                  type="text" 
                  id="userSearchInput" 
                  placeholder="🔍 Buscar por nombre o email..." 
                  className="input-dark" 
                  style={{ maxWidth: '320px', padding: '0.6rem 0.9rem', fontSize: '0.88rem' }} 
                />
              </div>

              {/* Mobile View: Card List */}
              <div className="admin-users-card-container" id="usersCardList">
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Cargando alumnos...</div>
              </div>

              {/* Desktop View: Full Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody id="usersTableBody">
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>Cargando alumnos...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB 2: GESTOR DE CONTENIDO */}
            <div id="tabResourcesContent" style={{ display: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                
                {/* Formulario Agregar Recurso */}
                <div style={{ background: '#141418', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>➕</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--accent-gold)', letterSpacing: '0.03em' }}>
                      Subir Material / Módulo
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.45' }}>
                    Estos recursos serán visibles automáticamente para los alumnos con acceso activo en su perfil.
                  </p>
                  
                  <form id="addResourceForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Título del recurso</label>
                      <input type="text" id="resTitle" placeholder="Ej: Módulo 1 - Estrategia de Marca" required className="input-dark" />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Tipo de material</label>
                      <select id="resType" required className="input-dark" style={{ cursor: 'pointer' }}>
                        <option value="video">▶ Enlace de Video (YouTube / Vimeo)</option>
                        <option value="link">🔗 Material Descargable (Drive / PDF)</option>
                        <option value="text">📄 Texto Informativo / Instrucciones</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>URL o Contenido</label>
                      <input type="text" id="resUrl" placeholder="https://... o texto explicativo" required className="input-dark" />
                    </div>

                    <button type="submit" className="btn-cta" style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                      + Agregar Recurso
                    </button>
                  </form>
                </div>

                {/* Lista de Recursos Habilitados */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--accent-gold)', letterSpacing: '0.03em' }}>
                      Recursos Habilitados
                    </h3>
                  </div>
                  <div id="resourcesList" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Cargando recursos...</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
