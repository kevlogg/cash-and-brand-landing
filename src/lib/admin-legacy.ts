// @ts-nocheck
import { auth, db } from './firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';

export function initAll() {
  const adminLoginState = document.getElementById('adminLoginState');
  const adminDashboardState = document.getElementById('adminDashboardState');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const btnLogout = document.getElementById('btnLogout');
  const usersTableBody = document.getElementById('usersTableBody');
  const usersCardList = document.getElementById('usersCardList');
  const addResourceForm = document.getElementById('addResourceForm');
  const resourcesList = document.getElementById('resourcesList');
  
  const tabBtnUsers = document.getElementById('tabBtnUsers');
  const tabBtnResources = document.getElementById('tabBtnResources');
  const tabUsersContent = document.getElementById('tabUsersContent');
  const tabResourcesContent = document.getElementById('tabResourcesContent');
  
  const statTotalUsers = document.getElementById('statTotalUsers');
  const statPaidUsers = document.getElementById('statPaidUsers');
  const statUnpaidUsers = document.getElementById('statUnpaidUsers');
  const usersCountBadge = document.getElementById('usersCountBadge');
  const resCountBadge = document.getElementById('resCountBadge');
  const userSearchInput = document.getElementById('userSearchInput');

  let allUsersData = [];

  // Tab Switching
  if (tabBtnUsers && tabBtnResources) {
    tabBtnUsers.addEventListener('click', () => {
      tabBtnUsers.classList.add('active');
      tabBtnResources.classList.remove('active');
      if (tabUsersContent) tabUsersContent.style.display = 'block';
      if (tabResourcesContent) tabResourcesContent.style.display = 'none';
    });

    tabBtnResources.addEventListener('click', () => {
      tabBtnResources.classList.add('active');
      tabBtnUsers.classList.remove('active');
      if (tabUsersContent) tabUsersContent.style.display = 'none';
      if (tabResourcesContent) tabResourcesContent.style.display = 'block';
    });
  }

  // Real-time Search Filter
  if (userSearchInput) {
    userSearchInput.addEventListener('input', (e) => {
      const query = (e.target.value || '').toLowerCase().trim();
      const filtered = allUsersData.filter(u => {
        const fullName = `${u.name || ''} ${u.surname || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
      renderUsers(filtered);
    });
  }

  checkAdminSession();

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await signOut(auth);
      showLogin();
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;
      const submitBtn = e.target.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;
      }

      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await verifyAdminAccess(userCred.user);
      } catch (error) {
        alert('Error de acceso: ' + error.message);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = 'Entrar al Panel';
          submitBtn.disabled = false;
        }
      }
    });
  }

  function checkAdminSession() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await verifyAdminAccess(user);
      } else {
        showLogin();
      }
    });
  }

  async function verifyAdminAccess(user) {
    try {
      const allowedEmails = ['loggia.1996@gmail.com', 'loggia.996@gmail.com', 'brarecke@gmail.com'];
      const userEmail = (user.email || '').trim().toLowerCase();
      if (userEmail && allowedEmails.includes(userEmail)) {
        showDashboard();
        return;
      }

      const userDoc = await getDoc(doc(db, 'profiles', user.uid));
      if (userDoc.exists() && userDoc.data().is_admin === true) {
        showDashboard();
      } else {
        await signOut(auth);
        alert('Acceso denegado: No tienes permisos de Super Administrador.');
        showLogin();
      }
    } catch (error) {
      console.error('Error verifying admin access:', error);
      await signOut(auth);
      showLogin();
    }
  }

  function showLogin() {
    if (adminLoginState) adminLoginState.style.display = 'block';
    if (adminDashboardState) adminDashboardState.style.display = 'none';
    if (btnLogout) btnLogout.style.display = 'none';
  }

  function showDashboard() {
    if (adminLoginState) adminLoginState.style.display = 'none';
    if (adminDashboardState) adminDashboardState.style.display = 'block';
    if (btnLogout) btnLogout.style.display = 'inline-flex';
    loadUsers();
    loadResources();
  }

  async function getAuthToken() {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }
    } catch(e) {
      console.warn('Could not get id token:', e);
    }
    return '';
  }

  async function loadUsers() {
    try {
      const token = await getAuthToken();
      let users = [];

      // 1. Try Backend API (Admin SDK with full Firestore privileges)
      try {
        const res = await fetch('/api/admin/users', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          users = data.users || [];
        } else {
          throw new Error('API status ' + res.status);
        }
      } catch (apiErr) {
        console.warn('Backend API failed, trying direct client Firestore SDK...', apiErr);
        // 2. Fallback to direct client Firestore SDK
        const querySnapshot = await getDocs(collection(db, "profiles"));
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        users.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
      }

      allUsersData = users;

      // Update KPI counters
      const total = users.length;
      const paid = users.filter(u => Boolean(u.has_paid)).length;
      const unpaid = total - paid;

      if (statTotalUsers) statTotalUsers.textContent = String(total);
      if (statPaidUsers) statPaidUsers.textContent = String(paid);
      if (statUnpaidUsers) statUnpaidUsers.textContent = String(unpaid);
      if (usersCountBadge) usersCountBadge.textContent = String(total);

      renderUsers(users);

    } catch (error) {
      console.error('Error fetching users:', error);
      const errMsg = `Error al cargar alumnos: ${error.message || 'Verifica la conexión a Firestore'}`;
      if (usersTableBody) {
        usersTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #EF4444; padding: 2rem;">${errMsg}</td></tr>`;
      }
      if (usersCardList) {
        usersCardList.innerHTML = `<div style="text-align: center; color: #EF4444; padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">${errMsg}</div>`;
      }
    }
  }

  function renderUsers(users) {
    if (!users || users.length === 0) {
      if (usersTableBody) {
        usersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No se encontraron alumnos.</td></tr>';
      }
      if (usersCardList) {
        usersCardList.innerHTML = '<div style="text-align: center; padding: 2.5rem; color: var(--text-muted); background: #141418; border-radius: 12px;">No se encontraron alumnos.</div>';
      }
      return;
    }

    // Render Desktop Table
    if (usersTableBody) {
      usersTableBody.innerHTML = users.map(user => {
        const date = user.created_at ? new Date(user.created_at).toLocaleDateString('es-AR') : 'S/D';
        const isPaid = Boolean(user.has_paid);
        const paidStatus = isPaid 
          ? '<span class="status-paid">✓ Pagado</span>' 
          : '<span class="status-unpaid">⏳ Pendiente</span>';
        const toggleBtnText = isPaid ? 'Marcar Pendiente' : 'Activar Acceso';
        const toggleBtnClass = isPaid ? 'btn-toggle-pay to-unpaid' : 'btn-toggle-pay to-paid';

        return `
          <tr>
            <td style="font-weight: 700; color: var(--text-primary);">${user.name || ''} ${user.surname || ''}</td>
            <td style="color: var(--text-secondary);">${user.email || ''}</td>
            <td style="color: var(--text-muted); font-size: 0.9rem;">${date}</td>
            <td>${paidStatus}</td>
            <td style="text-align: right;">
              <button class="${toggleBtnClass}" data-uid="${user.id}" data-current="${isPaid}">
                ${toggleBtnText}
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Render Mobile Cards
    if (usersCardList) {
      usersCardList.innerHTML = users.map(user => {
        const initials = ((user.name ? user.name[0] : '') + (user.surname ? user.surname[0] : '') || user.email?.slice(0, 2) || 'AL').toUpperCase();
        const date = user.created_at ? new Date(user.created_at).toLocaleDateString('es-AR') : 'S/D';
        const isPaid = Boolean(user.has_paid);
        const paidStatus = isPaid 
          ? '<span class="status-paid">✓ Pagado</span>' 
          : '<span class="status-unpaid">⏳ Pendiente</span>';
        const toggleBtnText = isPaid ? 'Desactivar' : 'Activar Acceso';
        const toggleBtnClass = isPaid ? 'btn-toggle-pay to-unpaid' : 'btn-toggle-pay to-paid';

        return `
          <div class="admin-user-card">
            <div class="admin-user-card-top">
              <div class="admin-user-avatar">${initials}</div>
              <div class="admin-user-info">
                <div class="admin-user-name">${user.name || ''} ${user.surname || 'Alumno'}</div>
                <div class="admin-user-email">${user.email}</div>
              </div>
            </div>
            <div class="admin-user-card-meta">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                ${paidStatus}
                <span style="font-size: 0.8rem; color: var(--text-muted);">📅 ${date}</span>
              </div>
              <button class="${toggleBtnClass}" data-uid="${user.id}" data-current="${isPaid}">
                ${toggleBtnText}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Bind Toggle Payment Action Buttons
    document.querySelectorAll('.btn-toggle-pay').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.currentTarget.getAttribute('data-uid');
        const currentStatus = e.currentTarget.getAttribute('data-current') === 'true';
        const newStatus = !currentStatus;

        e.currentTarget.textContent = 'Actualizando...';
        e.currentTarget.disabled = true;

        try {
          const token = await getAuthToken();
          const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ uid, has_paid: newStatus })
          });

          if (!res.ok) {
            throw new Error('Error al actualizar en servidor');
          }

          await loadUsers();
        } catch (err) {
          alert('Error al actualizar estado: ' + err.message);
          await loadUsers();
        }
      });
    });
  }

  async function loadResources() {
    try {
      const token = await getAuthToken();
      let resources = [];

      try {
        const res = await fetch('/api/admin/resources', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          resources = data.resources || [];
        } else {
          throw new Error('API status ' + res.status);
        }
      } catch (apiErr) {
        console.warn('Backend resources API failed, trying direct client Firestore SDK...', apiErr);
        const querySnapshot = await getDocs(collection(db, "course_content"));
        querySnapshot.forEach((doc) => {
          resources.push({ id: doc.id, ...doc.data() });
        });
        resources.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
      }

      if (resCountBadge) resCountBadge.textContent = String(resources.length);

      if (!resources || resources.length === 0) {
        if (resourcesList) {
          resourcesList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.95rem; text-align: center; padding: 2rem; background: #141418; border-radius: 8px;">Aún no hay recursos subidos. Agrega el primero con el formulario.</div>';
        }
        return;
      }

      if (resourcesList) {
        resourcesList.innerHTML = resources.map(res => {
          let icon = '📄';
          let typeLabel = 'Texto';
          if (res.type === 'video') {
            icon = '▶';
            typeLabel = 'Video';
          } else if (res.type === 'link') {
            icon = '🔗';
            typeLabel = 'Material';
          }

          return `
            <div class="admin-res-card">
              <div style="display: flex; align-items: flex-start; gap: 0.85rem; min-width: 0; flex: 1;">
                <div style="font-size: 1.5rem; color: var(--accent-gold); flex-shrink: 0; margin-top: 2px;">${icon}</div>
                <div style="min-width: 0; flex: 1;">
                  <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem; line-height: 1.3;">${res.title}</div>
                  <span class="admin-res-badge">${typeLabel}</span>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <a href="${res.url}" target="_blank" rel="noopener noreferrer" style="color: var(--text-muted); text-decoration: underline;">${res.url}</a>
                  </div>
                </div>
              </div>
              <button class="btn-res-delete" data-id="${res.id}">
                <span>🗑</span> <span>Eliminar</span>
              </button>
            </div>
          `;
        }).join('');
      }

      // Bind Delete Button Listeners
      document.querySelectorAll('.btn-res-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('¿Seguro que deseas eliminar este recurso del curso?')) {
            e.currentTarget.textContent = 'Borrando...';
            e.currentTarget.disabled = true;

            try {
              const token = await getAuthToken();
              const res = await fetch(`/api/admin/resources?id=${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
              });

              if (!res.ok) {
                // Try client delete fallback
                await deleteDoc(doc(db, "course_content", id));
              }

              await loadResources();
            } catch (err) {
              alert('Error al eliminar recurso: ' + err.message);
              await loadResources();
            }
          }
        });
      });

    } catch (error) {
      console.error('Error fetching resources:', error);
      if (resourcesList) {
        resourcesList.innerHTML = `<div style="color: #EF4444; padding: 1.5rem; text-align: center; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">Error al cargar recursos: ${error.message}</div>`;
      }
    }
  }

  // Handle Adding Resources
  if (addResourceForm) {
    addResourceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('resTitle').value.trim();
      const type = document.getElementById('resType').value;
      const url = document.getElementById('resUrl').value.trim();
      const btn = e.target.querySelector('button[type="submit"]');

      if (btn) {
        btn.textContent = 'Guardando en la nube...';
        btn.disabled = true;
      }

      try {
        const token = await getAuthToken();
        const res = await fetch('/api/admin/resources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ title, type, url })
        });

        if (!res.ok) {
          // Client SDK fallback
          await addDoc(collection(db, "course_content"), {
            title,
            type,
            url,
            created_at: new Date().toISOString()
          });
        }

        addResourceForm.reset();
        await loadResources();
        alert('✓ Recurso agregado exitosamente.');
      } catch (error) {
        alert('Error al guardar recurso: ' + error.message);
      } finally {
        if (btn) {
          btn.textContent = '+ Agregar Recurso';
          btn.disabled = false;
        }
      }
    });
  }
}

