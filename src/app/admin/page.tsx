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
          <div className="admin-header">
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', letterSpacing: '0.04em' }}>
                Panel Super Admin - <span style={{ color: 'var(--accent-orange)' }}>CASH & BRAND</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Gestión de alumnos, pagos y materiales de formación
              </p>
            </div>
            <button id="btnLogout" className="btn-logout" type="button" style={{ display: 'none' }}>
              <span>Cerrar Sesión</span>
              <span style={{ fontSize: '0.8rem' }}>✕</span>
            </button>
          </div>

          {/* Login Admin State */}
          <div id="adminLoginState" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 160, 0, 0.15)', border: '1px solid rgba(255, 160, 0, 0.35)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1.25rem auto' }}>
              🛡️
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Acceso Administrador
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Ingresa con tus credenciales autorizadas
            </p>

            <form id="adminLoginForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <input type="email" id="adminEmail" placeholder="Correo del Admin" required className="input-dark" />
              <input type="password" id="adminPassword" placeholder="Contraseña" required className="input-dark" />
              <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '0.5rem' }}>Entrar al Panel</button>
            </form>
          </div>

          {/* Admin Dashboard State */}
          <div id="adminDashboardState" style={{ display: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
              {/* Left: Users Table */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--accent-gold)', letterSpacing: '0.03em' }}>
                    Alumnos Registrados
                  </h3>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody id="usersTableBody">
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>Cargando usuarios...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Content Manager */}
              <div style={{ background: '#16161A', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255, 160, 0, 0.35)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--accent-gold)', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>
                  Gestor de Contenido (Alumnos)
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  Sube aquí los recursos (videos, enlaces a Drive/PDF, textos) visibles para alumnos con acceso activo.
                </p>
                
                <form id="addResourceForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <input type="text" id="resTitle" placeholder="Título (ej: Módulo 1 - Bienvenida)" required className="input-dark" />
                  <select id="resType" required className="input-dark" style={{ cursor: 'pointer' }}>
                    <option value="video">Enlace de Video (YouTube/Vimeo)</option>
                    <option value="link">Enlace a Material (Drive/PDF)</option>
                    <option value="text">Texto Informativo</option>
                  </select>
                  <input type="text" id="resUrl" placeholder="URL o Texto explicativo" required className="input-dark" />
                  <button type="submit" className="btn-cta" style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}>+ Agregar Recurso</button>
                </form>

                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                  Recursos Habilitados
                </h4>
                <div id="resourcesList" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>Cargando recursos...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
