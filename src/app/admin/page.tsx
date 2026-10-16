"use client";
import { useEffect, useState } from 'react';
import { initAll } from '@/lib/admin-legacy';

export default function Page() {
  const [conditionsOpen, setConditionsOpen] = useState(true);

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
                <h2 className="admin-header-title">
                  Panel Super Admin
                </h2>
                <span className="badge badge-gold" style={{ margin: 0, padding: '0.25rem 0.75rem', fontSize: '0.78rem' }}>
                  🛡️ ACCESO MAESTRO
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Gestión en tiempo real de alumnos, accesos y módulos de CASH & BRAND
              </p>
            </div>
            <button id="btnLogout" className="btn-logout" type="button" style={{ display: 'none' }}>
              <span>Cerrar Sesión</span>
              <span style={{ fontSize: '0.8rem' }}>✕</span>
            </button>
          </div>

          {/* Login / Register Admin State */}
          <div id="adminLoginState" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 160, 0, 0.15)', border: '1.5px solid rgba(255, 160, 0, 0.4)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1.25rem auto' }}>
              🛡️
            </div>
            <h3 id="adminAuthTitle" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Acceso Administrador
            </h3>
            <p id="adminAuthSubtitle" style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Ingresa con tus credenciales autorizadas
            </p>

            {/* Selector de modo: Iniciar Sesión / Crear Cuenta */}
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', padding: '4px', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button type="button" id="btnModeLogin" style={{ flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--gradient-primary)', color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                Iniciar Sesión
              </button>
              <button type="button" id="btnModeRegister" style={{ flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-full)', border: 'none', background: 'transparent', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                Crear Cuenta
              </button>
            </div>

            {/* FORMULARIO DE INICIO DE SESIÓN */}
            <form id="adminLoginForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Correo electrónico autorizado</label>
                <input type="email" id="adminEmail" placeholder="ej: brarecke@gmail.com" required className="input-dark" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Contraseña</label>
                <input type="password" id="adminPassword" placeholder="••••••••" required className="input-dark" />
              </div>
              <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '0.5rem' }}>Entrar al Panel</button>
              <div style={{ textAlign: 'center', marginTop: '0.4rem' }}>
                <button type="button" id="btnForgotAdminPass" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>

            {/* FORMULARIO DE CREACIÓN DE CUENTA ADMINISTRADOR */}
            <form id="adminRegisterForm" style={{ display: 'none', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Nombre completo</label>
                <input type="text" id="regAdminName" placeholder="ej: Brian Recke" required className="input-dark" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Correo electrónico autorizado</label>
                <input type="email" id="regAdminEmail" placeholder="ej: brarecke@gmail.com" required className="input-dark" />
                <span style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', marginTop: '0.25rem', display: 'block' }}>
                  🛡️ Solo correos autorizados por el sistema
                </span>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Contraseña (mínimo 6 caracteres)</label>
                <input type="password" id="regAdminPassword" placeholder="••••••••" minLength={6} required className="input-dark" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Confirmar Contraseña</label>
                <input type="password" id="regAdminPasswordConfirm" placeholder="••••••••" minLength={6} required className="input-dark" />
              </div>
              <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '0.5rem' }}>Registrar Cuenta Administrador</button>
            </form>
          </div>

          {/* Admin Dashboard State */}
          <div id="adminDashboardState" style={{ display: 'none' }}>
            
            {/* Banner oficial de sincronización de Mercado Pago (se oculta automáticamente una vez conectado) */}
            <div id="mpConnectBanner" style={{ display: 'none' }} className="admin-mp-banner">
              <div className="admin-mp-banner-info">
                <div className="admin-mp-banner-title">
                  <span>💳</span> Pasarela Oficial de Cobros
                </div>
                <div className="admin-mp-banner-desc">
                  Sincroniza la cuenta oficial de Mercado Pago para procesar inscripciones directamente.
                </div>
              </div>
              <a 
                id="btnMpConnect"
                href="https://auth.mercadopago.com/authorization?client_id=5679645126166390&response_type=code&platform_id=mp&redirect_uri=https://brianrecke.com/api/admin/mp/callback" 
                className="btn-mp-connect"
              >
                <span>🔗</span> Conectar cuenta de Mercado Pago
              </a>
            </div>

            {/* Layout Grid: Sidebar a la izquierda + Panel Principal a la derecha */}
            <div className="admin-dashboard-layout">
              {/* SIDEBAR NAVIGATION */}
              <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                  <span className="admin-sidebar-title">Menú de Gestión</span>
                </div>
                
                <nav className="admin-sidebar-nav">
                  <button type="button" id="tabBtnUsers" className="admin-sidebar-btn active">
                    <div className="admin-sidebar-btn-content">
                      <span className="admin-sidebar-icon">👥</span>
                      <span className="admin-sidebar-label">Alumnos</span>
                    </div>
                    <span id="usersCountBadge" className="admin-sidebar-count">0</span>
                  </button>

                  <button type="button" id="tabBtnResources" className="admin-sidebar-btn">
                    <div className="admin-sidebar-btn-content">
                      <span className="admin-sidebar-icon">📚</span>
                      <span className="admin-sidebar-label">Contenido</span>
                    </div>
                    <span id="resCountBadge" className="admin-sidebar-count">0</span>
                  </button>

                  <button type="button" id="tabBtnPlan" className="admin-sidebar-btn">
                    <div className="admin-sidebar-btn-content">
                      <span className="admin-sidebar-icon">⚡</span>
                      <span className="admin-sidebar-label">Plan KevDev</span>
                    </div>
                    <span className="admin-sidebar-badge-active">ACTIVO</span>
                  </button>
                </nav>

                {/* Sub-tarjeta de Soporte & Partner KevDev en el sidebar */}
                <div className="admin-sidebar-partner-card">
                  <div className="admin-partner-icon-wrap">
                    <span>⚡</span>
                  </div>
                  <div className="admin-partner-info">
                    <div className="admin-partner-name">KevDev Partner</div>
                    <div className="admin-partner-desc">Soporte técnico y arquitectura por Kevin Loggia</div>
                  </div>
                  <a href="https://wa.me/5491122509176" target="_blank" rel="noopener noreferrer" className="admin-partner-btn">
                    <span>💬</span> WhatsApp Soporte
                  </a>
                </div>
              </aside>

              {/* MAIN CONTENT AREA */}
              <div className="admin-main-area">

                {/* TAB 1: ALUMNOS REGISTRADOS */}
                <div id="tabUsersContent">
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

                  <div className="admin-section-header">
                    <h3 className="admin-section-title">
                      Alumnos Registrados
                    </h3>
                    <div className="admin-search-wrapper">
                      <input 
                        type="text" 
                        id="userSearchInput" 
                        placeholder="🔍 Buscar por nombre o email..." 
                        className="input-dark admin-search-input" 
                      />
                    </div>
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
                  <div className="admin-content-grid">
                    
                    {/* Formulario Agregar Recurso */}
                    <div className="admin-content-form-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>➕</span>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--accent-gold)', letterSpacing: '0.03em' }}>
                          Subir Material / Módulo
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.45' }}>
                        Estos recursos serán visibles automáticamente para los alumnos con acceso activo en su perfil.
                      </p>
                      
                      <form id="addResourceForm" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {/* Method Selector */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                            Método de subida
                          </label>
                          <div className="admin-upload-mode-toggle">
                            <button type="button" id="modeBtnFile" className="admin-mode-btn active">
                              <span>📁 Archivo a Storage</span>
                            </button>
                            <button type="button" id="modeBtnUrl" className="admin-mode-btn">
                              <span>🔗 Enlace externo</span>
                            </button>
                          </div>
                        </div>

                        {/* Título */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                            Título del material
                          </label>
                          <input type="text" id="resTitle" placeholder="Ej: Guía Módulo 1 - Estrategia" required className="input-dark" />
                        </div>

                        {/* Tipo de material */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                            Categoría
                          </label>
                          <select id="resType" required className="input-dark" style={{ cursor: 'pointer' }}>
                            <option value="link">📄 Documento descargable (PDF / Guía / ZIP)</option>
                            <option value="video">▶ Video / Clase grabada (MP4 / YouTube)</option>
                            <option value="text">📝 Instrucción / Texto explicativo</option>
                          </select>
                        </div>

                        {/* Opción A: Subida directa de archivo a Firebase Storage */}
                        <div id="fileUploadContainer">
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                            Archivo desde tu equipo (Firebase Storage)
                          </label>
                          <input 
                            type="file" 
                            id="resFileInput" 
                            style={{ display: 'none' }} 
                            accept=".pdf,.doc,.docx,.epub,.zip,.rar,.mp4,.mov,.webm,.png,.jpg,.jpeg,.webp" 
                          />
                          <div id="dropzoneBox" className="admin-dropzone">
                            <span style={{ fontSize: '2rem' }}>☁️</span>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                              Haz clic o arrastra tu archivo aquí
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              PDF, Word, MP4, ZIP, Imágenes
                            </div>
                          </div>

                          {/* Badge de archivo seleccionado */}
                          <div id="fileSelectedBadge" className="admin-file-badge" style={{ display: 'none', marginTop: '0.6rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                              <span style={{ fontSize: '1.3rem' }}>📄</span>
                              <div style={{ overflow: 'hidden' }}>
                                <div id="fileNameLabel" style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>archivo.pdf</div>
                                <div id="fileSizeLabel" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 KB</div>
                              </div>
                            </div>
                            <button type="button" id="btnRemoveFile" title="Quitar archivo" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', padding: '0.25rem 0.5rem' }}>
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Opción B: Enlace externo (YouTube, Drive, etc.) */}
                        <div id="urlInputContainer" style={{ display: 'none' }}>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                            Enlace o URL
                          </label>
                          <input type="text" id="resUrl" placeholder="https://youtube.com/... o https://drive.google.com/..." className="input-dark" />
                        </div>

                        {/* Barra de progreso de subida en tiempo real */}
                        <div id="uploadProgressBox" className="admin-progress-box" style={{ display: 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                            <span id="uploadStatusText" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Subiendo a Firebase Storage...</span>
                            <span id="uploadPercentText" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>0%</span>
                          </div>
                          <div className="admin-progress-track">
                            <div id="uploadProgressFill" className="admin-progress-fill"></div>
                          </div>
                        </div>

                        <button type="submit" id="btnSubmitResource" className="btn-cta" style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', marginTop: '0.35rem' }}>
                          + Subir a la plataforma
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

                {/* TAB 3: PLAN KEVDEV */}
                <div id="tabPlanContent" style={{ display: 'none' }} className="plan-section-wrapper">
                  <div className="plan-content-stack">

                    {/* CARD 1: PLAN ACTIVO */}
                    <div className="plan-card">
                      <div className="plan-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '1.35rem' }}>💳</span>
                          <h4 className="plan-card-title">Plan activo</h4>
                        </div>
                      </div>

                      {/* Grid de métricas principales del acuerdo */}
                      <div className="plan-metrics-grid">
                        <div className="plan-metric-item">
                          <span className="plan-metric-label">INICIO DEL PROYECTO</span>
                          <strong className="plan-metric-value" id="planMetricInicio">10/10/2026</strong>
                        </div>
                        <div className="plan-metric-item">
                          <span className="plan-metric-label">TIPO</span>
                          <strong className="plan-metric-value">Mensual</strong>
                        </div>
                        <div className="plan-metric-item">
                          <span className="plan-metric-label">MONTO ACTUAL</span>
                          <strong className="plan-metric-value">$ 33.000/mes</strong>
                        </div>
                        <div className="plan-metric-item">
                          <span className="plan-metric-label">PROXIMO PAGO</span>
                          <strong className="plan-metric-value" id="planMetricProximo">10/11/2026</strong>
                        </div>
                        <div className="plan-metric-item">
                          <span className="plan-metric-label">SALDO PENDIENTE</span>
                          <strong className="plan-metric-value text-green" id="planMetricSaldo">$ 0 (Al día)</strong>
                        </div>
                      </div>

                      {/* Banner de Estado del Servicio / Próximo Pago */}
                      <div className="plan-reminder-box" id="planReminderBox">
                        <span style={{ fontSize: '1.2rem', color: '#10B981' }} id="planReminderIcon">✓</span>
                        <span className="plan-reminder-text" id="planReminderText">
                          Estado del servicio: <strong style={{ color: '#10B981' }}>Al día</strong> — Próximo vencimiento: <strong>10/11/2026</strong> ($ 33.000)
                        </span>
                      </div>
                    </div>

                    {/* CARD: HISTORIAL DE PAGOS */}
                    <div className="plan-card">
                      <div className="plan-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '1.35rem' }}>📜</span>
                          <h4 className="plan-card-title">Historial de Pagos</h4>
                        </div>
                        <span className="badge badge-gold" style={{ margin: 0, padding: '0.2rem 0.65rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>⚡</span> Sincronizado con KevDev
                        </span>
                      </div>

                      {/* Desktop Table */}
                      <div className="admin-table-container" style={{ marginTop: '0.5rem', background: '#0a0a0d' }}>
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Concepto</th>
                              <th>Medio</th>
                              <th>Monto</th>
                              <th style={{ textAlign: 'right' }}>Estado</th>
                            </tr>
                          </thead>
                          <tbody id="planPaymentsTableBody">
                            <tr>
                              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                Conectando con KevDev...
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="admin-users-card-container" id="planPaymentsCardList" style={{ marginTop: '0.75rem' }}>
                        {/* Se renderiza en mobile */}
                      </div>
                    </div>

                    {/* CARD 2: CONDICIONES DEL ACUERDO (ACCORDION) */}
                    <div className="plan-card plan-accordion-card">
                      <button 
                        type="button" 
                        id="toggleConditionsBtn" 
                        className="plan-accordion-trigger"
                        onClick={() => setConditionsOpen(prev => !prev)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>ⓘ</span>
                          <h4 className="plan-card-title" style={{ margin: 0 }}>Condiciones del acuerdo</h4>
                        </div>
                        <span 
                          id="conditionsChevron" 
                          className="plan-accordion-chevron"
                          style={{ transform: conditionsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          ▼
                        </span>
                      </button>

                      <div 
                        id="conditionsBody" 
                        className="plan-accordion-body" 
                        style={{ display: conditionsOpen ? 'block' : 'none' }}
                      >
                        <div className="plan-terms-content">
                          {/* Plan Mensual */}
                          <div className="plan-term-group">
                            <h5 className="plan-term-title">Plan mensual</h5>
                            <ul className="plan-term-list">
                              <li>Pago mensual fijo de $ 33.000.</li>
                              <li>El precio se ajusta cada 6 meses por la variacion del componente Servicios del IPC publicado por INDEC en los 6 meses anteriores a la fecha de ajuste. El aumento se calcula multiplicando los factores mensuales (no sumando).</li>
                              <li>El servicio incluye hosting, actualizaciones de seguridad y soporte tecnico ante errores o caidas.</li>
                              <li>Cualquier modificacion, nueva seccion o desarrollo adicional se presupuesta por separado, ya que implica tiempo de desarrollo.</li>
                            </ul>
                          </div>

                          <div className="plan-term-divider"></div>

                          {/* Plan Pago Único */}
                          <div className="plan-term-group">
                            <h5 className="plan-term-title">Plan pago unico</h5>
                            <ul className="plan-term-list">
                              <li>Pago unico de $ 250.000 que cubre el desarrollo completo.</li>
                              <li>El precio se ajusta cada 6 meses por la variacion del componente Servicios del IPC publicado por INDEC en los 6 meses anteriores a la fecha de ajuste. El aumento se calcula multiplicando los factores mensuales (no sumando).</li>
                              <li>Incluye renovacion anual de $ 45.000, tambien sujeto a ajuste por IPC cada 6 meses.</li>
                              <li>El mantenimiento cubre actualizaciones de seguridad y correccion de errores del sistema existente.</li>
                              <li>Cualquier modificacion, nueva seccion o desarrollo adicional se presupuesta por separado, ya que implica tiempo de desarrollo.</li>
                            </ul>
                          </div>

                          <div className="plan-term-divider"></div>

                          <div className="plan-term-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                            Ante cualquier consulta sobre el plan, comunicarse directamente con Kevin Loggia.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 3: MESES BONIFICADOS POR REFERIDOS */}
                    <div className="plan-card plan-card-referrals">
                      <div className="plan-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '1.35rem' }}>🎁</span>
                          <h4 className="plan-card-title">Meses bonificados por referidos</h4>
                        </div>
                        <span className="plan-referral-counter-badge">
                          1 de 12 Referidos
                        </span>
                      </div>

                      <p className="plan-referral-lead">
                        Por cada cliente que recomiendes a KevDev y contrate su sitio web, se te bonifica <strong>1 mes de suscripción</strong>. Al alcanzar los 12 referidos, queda <strong>100% bonificado el pago único</strong> del desarrollo.
                      </p>

                      {/* Barra de Progreso de Referidos */}
                      <div className="plan-referral-progress-wrap">
                        <div className="plan-referral-progress-labels">
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem' }}>
                            Progreso: 1 de 12 clientes referidos
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            Meta: 12 Clientes
                          </span>
                        </div>
                        <div className="plan-referral-track">
                          <div className="plan-referral-fill" style={{ width: '8.33%' }}></div>
                        </div>
                        <div className="plan-referral-milestones">
                          <span className="plan-milestone active">✓ 1 Mes bonificado</span>
                          <span className="plan-milestone">6 Meses (Semestral)</span>
                          <span className="plan-milestone">🏆 12 (Desarrollo Bonificado)</span>
                        </div>
                      </div>

                      {/* Detalle del Cliente Referido Acreditado */}
                      <div className="plan-referred-client-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="plan-client-check-icon">✓</div>
                          <div>
                            <div className="plan-client-name">Los Calvos Compresores</div>
                            <div className="plan-client-note">Cliente referido verificado • 1 mes de bonificación aplicado</div>
                          </div>
                        </div>
                        <span className="badge badge-gold" style={{ margin: 0, padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
                          1 MES BONIFICADO
                        </span>
                      </div>

                      {/* Beneficios Explicados */}
                      <div className="plan-benefits-grid">
                        <div className="plan-benefit-card">
                          <div className="plan-benefit-icon">🎁</div>
                          <div>
                            <h5 className="plan-benefit-title">1 Mes Gratis por cada Referido</h5>
                            <p className="plan-benefit-desc">
                              Por cada cliente que contrate servicios web recomendándote, sumás automáticamente 1 mes ($ 33.000) bonificado en tu suscripción mensual de KevDev.
                            </p>
                          </div>
                        </div>

                        <div className="plan-benefit-card highlight">
                          <div className="plan-benefit-icon">🏆</div>
                          <div>
                            <h5 className="plan-benefit-title">A los 12 Referidos: Bonificación Total</h5>
                            <p className="plan-benefit-desc">
                              Al llegar a los 12 clientes referidos, el costo completo del desarrollo ($ 250.000) queda totalmente bonificado, abonando en adelante únicamente la renovación anual ($ 45.000).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

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
