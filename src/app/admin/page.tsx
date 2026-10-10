"use client";
import { useEffect } from 'react';
import { initAll } from '@/lib/admin-legacy';

export default function Page() {
  useEffect(() => {
    initAll();
  }, []);
  return (
    <>
      

  <div className="admin-container">
    <div className="admin-header">
      <h2>Panel Super Admin - <span style={{'color': 'var(--accent-orange)'}}>CASH & BRAND</span></h2>
      <button id="btnLogout" className="btn-cta" style={{'padding': '0.5rem 1rem'}}>Cerrar Sesión</button>
    </div>

    {/* Login Admin State */}
    <div id="adminLoginState">
      <h3>Acceso Administrador</h3>
      <form id="adminLoginForm" style={{'display': 'flex', 'flexDirection': 'column', 'gap': '1rem', 'maxWidth': '400px', 'marginTop': '1rem'}}>
        <input type="email" id="adminEmail" placeholder="Correo del Admin" required style={{'padding': '0.75rem', 'border': '1px solid #333', 'background': '#222', 'color': '#fff', 'borderRadius': '4px'}} />
        <input type="password" id="adminPassword" placeholder="Contraseña" required style={{'padding': '0.75rem', 'border': '1px solid #333', 'background': '#222', 'color': '#fff', 'borderRadius': '4px'}} />
        <button type="submit" className="btn-cta">Entrar</button>
      </form>
    </div>

    {/* Admin Dashboard State */}
    <div id="adminDashboardState" style={{'display': 'none'}}>
      
      <div style={{'display': 'flex', 'gap': '2rem'}}>
        {/* Left: Users Table */}
        <div style={{'flex': '1'}}>
          <h3 style={{'marginBottom': '1rem', 'color': 'var(--accent-gold)'}}>Usuarios Registrados</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Estado Pago</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <tr>
                <td colSpan={4} style={{'textAlign': 'center', 'color': '#888'}}>Cargando usuarios...</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Content Manager */}
        <div style={{'flex': '1', 'background': '#1a1a1a', 'padding': '1.5rem', 'borderRadius': 'var(--radius-md)', 'border': '1px dashed rgba(255, 160, 0, 0.3)'}}>
          <h3 style={{'marginBottom': '1rem', 'color': 'var(--accent-gold)'}}>Gestor de Contenido (Alumnos)</h3>
          <p style={{'fontSize': '0.9rem', 'color': 'var(--text-muted)', 'marginBottom': '1rem'}}>Sube aquí los recursos (videos, links, textos) que verán los alumnos que ya pagaron.</p>
          
          <form id="addResourceForm" style={{'display': 'flex', 'flexDirection': 'column', 'gap': '1rem', 'marginBottom': '2rem'}}>
            <input type="text" id="resTitle" placeholder="Título (ej: Módulo 1 - Bienvenida)" required style={{'padding': '0.75rem', 'border': '1px solid #333', 'background': '#222', 'color': '#fff', 'borderRadius': '4px'}} />
            <select id="resType" required style={{'padding': '0.75rem', 'border': '1px solid #333', 'background': '#222', 'color': '#fff', 'borderRadius': '4px'}}>
              <option value="video">Enlace de Video (YouTube/Vimeo)</option>
              <option value="link">Enlace a Material (Drive/PDF)</option>
              <option value="text">Texto Informativo</option>
            </select>
            <input type="text" id="resUrl" placeholder="URL o Texto" required style={{'padding': '0.75rem', 'border': '1px solid #333', 'background': '#222', 'color': '#fff', 'borderRadius': '4px'}} />
            <button type="submit" className="btn-cta" style={{'padding': '0.75rem'}}>+ Agregar Recurso</button>
          </form>

          <h4 style={{'marginBottom': '1rem', 'color': 'var(--text-primary)'}}>Recursos Actuales</h4>
          <div id="resourcesList" style={{'display': 'flex', 'flexDirection': 'column', 'gap': '0.5rem'}}>
            <div style={{'color': '#888'}}>Cargando recursos...</div>
          </div>
        </div>
      </div>

    </div>
  </div>

  

    </>
  );
}
