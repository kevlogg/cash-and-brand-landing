// @ts-nocheck
import { auth, db, storage } from './firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

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

  const adminRegisterForm = document.getElementById('adminRegisterForm');
  const btnModeLogin = document.getElementById('btnModeLogin');
  const btnModeRegister = document.getElementById('btnModeRegister');
  const btnForgotAdminPass = document.getElementById('btnForgotAdminPass');

  // Toggle between Login and Register tabs
  if (btnModeLogin && btnModeRegister) {
    btnModeLogin.addEventListener('click', () => {
      btnModeLogin.style.background = 'var(--gradient-primary)';
      btnModeLogin.style.color = '#000';
      btnModeLogin.style.fontWeight = '700';

      btnModeRegister.style.background = 'transparent';
      btnModeRegister.style.color = 'var(--text-muted)';
      btnModeRegister.style.fontWeight = '600';

      if (adminLoginForm) adminLoginForm.style.display = 'flex';
      if (adminRegisterForm) adminRegisterForm.style.display = 'none';
      const title = document.getElementById('adminAuthTitle');
      const subtitle = document.getElementById('adminAuthSubtitle');
      if (title) title.textContent = 'Acceso Administrador';
      if (subtitle) subtitle.textContent = 'Ingresa con tus credenciales autorizadas';
    });

    btnModeRegister.addEventListener('click', () => {
      btnModeRegister.style.background = 'var(--gradient-primary)';
      btnModeRegister.style.color = '#000';
      btnModeRegister.style.fontWeight = '700';

      btnModeLogin.style.background = 'transparent';
      btnModeLogin.style.color = 'var(--text-muted)';
      btnModeLogin.style.fontWeight = '600';

      if (adminLoginForm) adminLoginForm.style.display = 'none';
      if (adminRegisterForm) adminRegisterForm.style.display = 'flex';
      const title = document.getElementById('adminAuthTitle');
      const subtitle = document.getElementById('adminAuthSubtitle');
      if (title) title.textContent = 'Crear Cuenta Administrador';
      if (subtitle) subtitle.textContent = 'Registra tu acceso oficial de administrador';
    });
  }

  // Handle Admin Login Form
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
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          alert('Credenciales incorrectas o el usuario no existe. Si es tu primera vez, haz clic en "Crear Cuenta".');
        } else {
          alert('Error de acceso: ' + error.message);
        }
      } finally {
        if (submitBtn) {
          submitBtn.textContent = 'Entrar al Panel';
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Handle Admin Register Form
  if (adminRegisterForm) {
    adminRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('regAdminName')?.value || '').trim();
      const email = (document.getElementById('regAdminEmail')?.value || '').trim().toLowerCase();
      const password = document.getElementById('regAdminPassword')?.value || '';
      const confirmPassword = document.getElementById('regAdminPasswordConfirm')?.value || '';
      const submitBtn = e.target.querySelector('button[type="submit"]');

      const allowedEmails = ['loggia.1996@gmail.com', 'loggia.996@gmail.com', 'brarecke@gmail.com'];
      if (!allowedEmails.includes(email)) {
        alert(`Acceso denegado: El correo "${email}" no está autorizado en la lista de administradores del sistema.`);
        return;
      }

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor verifica.');
        return;
      }

      if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = 'Registrando...';
        submitBtn.disabled = true;
      }

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Guardar perfil de administrador explícito en Firestore
        try {
          await setDoc(doc(db, 'profiles', userCred.user.uid), {
            name: name || 'Brian Recke',
            email: email,
            is_admin: true,
            role: 'admin',
            created_at: new Date().toISOString()
          }, { merge: true });
        } catch (fsErr) {
          console.warn('Could not write profile doc to Firestore:', fsErr);
        }

        alert(`✓ Cuenta de administrador creada exitosamente. ¡Bienvenido ${name || email}!`);
        await verifyAdminAccess(userCred.user);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Esta cuenta ya existe. Por favor selecciona la pestaña "Iniciar Sesión" para ingresar con tu contraseña.');
          if (btnModeLogin) btnModeLogin.click();
        } else {
          alert('Error al registrar cuenta: ' + error.message);
        }
      } finally {
        if (submitBtn) {
          submitBtn.textContent = 'Registrar Cuenta Administrador';
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Handle Forgot Password
  if (btnForgotAdminPass) {
    btnForgotAdminPass.addEventListener('click', async () => {
      const emailInput = document.getElementById('adminEmail');
      const currentEmail = (emailInput?.value || '').trim();
      const email = prompt('Ingresa tu correo de administrador para recibir el enlace de restablecimiento de contraseña:', currentEmail);
      if (!email) return;

      try {
        await sendPasswordResetEmail(auth, email.trim().toLowerCase());
        alert(`✓ Se envió un correo de restablecimiento a ${email}. Revisa tu bandeja de entrada o spam.`);
      } catch (err) {
        alert('Error al enviar correo de recuperación: ' + err.message);
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
    checkMpStatus();
    loadUsers();
    loadResources();
  }

  async function checkMpStatus() {
    const banner = document.getElementById('mpConnectBanner');
    if (!banner) return;

    // Verificar si viene con parámetro de redirección tras autorizar en MP
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mp_connected') === 'true') {
      alert('✓ Cuenta oficial de Mercado Pago vinculada exitosamente.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('mp_error')) {
      alert('⚠️ Hubo un inconveniente al vincular la cuenta. Por favor intenta de nuevo.');
      window.history.replaceState({}, '', window.location.pathname);
    }

    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/mp/status', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          // Ya está conectado: el botón NO debe aparecer nunca más
          banner.style.display = 'none';
          banner.remove();
          return;
        }
      }
      // Si no está conectado todavía, mostrar el banner
      banner.style.display = 'flex';
    } catch(err) {
      console.warn('Error checking MP connection status:', err);
    }
  }

  async function getAuthToken() {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken(true);
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

      let res;
      try {
        res = await fetch('/api/admin/users', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
      } catch (fetchErr) {
        throw new Error('No se pudo conectar con el servidor: ' + fetchErr.message);
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status} al consultar alumnos`);
      }

      const data = await res.json();
      const rawUsers = data.users || [];

      // Filtrar administradores para garantizar que nunca aparezcan en la lista de alumnos ni en los KPIs
      const currentAdminEmail = (auth.currentUser?.email || '').toLowerCase().trim();
      const currentAdminUid = auth.currentUser?.uid;
      const adminEmails = ['brarecke@gmail.com', 'loggia.1996@gmail.com', 'loggia.996@gmail.com'];

      users = rawUsers.filter(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        if (u.is_admin === true || u.role === 'admin') return false;
        if (adminEmails.includes(uEmail)) return false;
        if (uEmail && uEmail.includes('brarecke')) return false;
        if (currentAdminEmail && uEmail === currentAdminEmail) return false;
        if (currentAdminUid && u.id === currentAdminUid) return false;
        return true;
      });

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
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; justify-content: flex-end;">
                <button class="${toggleBtnClass}" data-uid="${user.id}" data-current="${isPaid}">
                  ${toggleBtnText}
                </button>
                <button class="btn-delete-user" data-uid="${user.id}" data-name="${(user.name || '') + ' ' + (user.surname || '')}" data-email="${user.email || ''}" title="Eliminar alumno">
                  <span>🗑️</span>
                </button>
              </div>
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
            <div class="admin-user-card-status-row">
              ${paidStatus}
              <span class="admin-user-date">📅 ${date}</span>
            </div>
            <div class="admin-user-card-actions">
              <button class="${toggleBtnClass}" data-uid="${user.id}" data-current="${isPaid}">
                ${toggleBtnText}
              </button>
              <button class="btn-delete-user" data-uid="${user.id}" data-name="${(user.name || '') + ' ' + (user.surname || '')}" data-email="${user.email || ''}" title="Eliminar alumno">
                <span>🗑️</span>
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

    // Bind Delete User Action Buttons with Confirmation
    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.currentTarget.getAttribute('data-uid');
        const name = (e.currentTarget.getAttribute('data-name') || '').trim();
        const email = e.currentTarget.getAttribute('data-email') || '';
        const displayName = name ? `${name} (${email})` : email;

        const confirmed = confirm(
          `⚠️ ¿Estás seguro de que deseas eliminar permanentemente a este alumno?\n\n` +
          `• Alumno: ${displayName}\n\n` +
          `Esta acción revocará su acceso al curso y no se puede deshacer.`
        );

        if (!confirmed) return;

        const btnEl = e.currentTarget;
        const originalContent = btnEl.innerHTML;
        btnEl.innerHTML = '⏳';
        btnEl.disabled = true;

        try {
          const token = await getAuthToken();
          const res = await fetch(`/api/admin/users?uid=${uid}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.error || 'Error al eliminar alumno en el servidor');
          }

          alert(`✓ Alumno "${displayName}" eliminado correctamente.`);
          await loadUsers();
        } catch (err) {
          alert('Error al eliminar alumno: ' + (err.message || 'Desconocido'));
          btnEl.innerHTML = originalContent;
          btnEl.disabled = false;
        }
      });
    });
  }

  async function loadResources() {
    try {
      const token = await getAuthToken();
      let resources = [];

      let res;
      try {
        res = await fetch('/api/admin/resources', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
      } catch (fetchErr) {
        throw new Error('No se pudo conectar con el servidor: ' + fetchErr.message);
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status} al consultar recursos`);
      }

      const data = await res.json();
      resources = data.resources || [];

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
              <div class="admin-res-card-content">
                <div class="admin-res-icon">${icon}</div>
                <div class="admin-res-info">
                  <div class="admin-res-title">${res.title}</div>
                  <div style="margin-top: 0.25rem;">
                    <span class="admin-res-badge">${typeLabel}</span>
                  </div>
                  <div class="admin-res-url">
                    <a href="${res.url}" target="_blank" rel="noopener noreferrer">${res.url}</a>
                  </div>
                </div>
              </div>
              <div class="admin-res-card-actions">
                <button class="btn-res-delete" data-id="${res.id}">
                  <span>🗑️</span> <span>Eliminar</span>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }

      // Bind Delete Button Listeners
      document.querySelectorAll('.btn-res-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const resObj = resources.find(r => r.id === id);

          if (confirm('¿Seguro que deseas eliminar este recurso del curso?')) {
            e.currentTarget.textContent = 'Borrando...';
            e.currentTarget.disabled = true;

            try {
              // Si el archivo está alojado en Firebase Storage, lo borramos también del bucket
              if (resObj && resObj.url && resObj.url.includes('firebasestorage.googleapis.com')) {
                try {
                  const fileStorageRef = ref(storage, resObj.url);
                  await deleteObject(fileStorageRef);
                } catch(stErr) {
                  console.warn('No se pudo borrar el archivo de Storage (puede que ya no exista):', stErr);
                }
              }

              const token = await getAuthToken();
              const res = await fetch(`/api/admin/resources?id=${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Error al eliminar el recurso en el servidor');
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

  // ==========================================================================
  // GESTIÓN DE SUBIDA DIRECTA A FIREBASE STORAGE
  // ==========================================================================
  const modeBtnFile = document.getElementById('modeBtnFile');
  const modeBtnUrl = document.getElementById('modeBtnUrl');
  const fileUploadContainer = document.getElementById('fileUploadContainer');
  const urlInputContainer = document.getElementById('urlInputContainer');
  const resFileInput = document.getElementById('resFileInput');
  const dropzoneBox = document.getElementById('dropzoneBox');
  const fileSelectedBadge = document.getElementById('fileSelectedBadge');
  const fileNameLabel = document.getElementById('fileNameLabel');
  const fileSizeLabel = document.getElementById('fileSizeLabel');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  const uploadProgressBox = document.getElementById('uploadProgressBox');
  const uploadStatusText = document.getElementById('uploadStatusText');
  const uploadPercentText = document.getElementById('uploadPercentText');
  const uploadProgressFill = document.getElementById('uploadProgressFill');
  const resTitle = document.getElementById('resTitle');
  const resType = document.getElementById('resType');
  const resUrl = document.getElementById('resUrl');

  let currentUploadMode = 'file'; // 'file' | 'url'
  let selectedFile = null;

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function handleFileSelected(file) {
    if (!file) return;
    selectedFile = file;
    if (fileNameLabel) fileNameLabel.textContent = file.name;
    if (fileSizeLabel) fileSizeLabel.textContent = formatBytes(file.size);
    if (fileSelectedBadge) fileSelectedBadge.style.display = 'flex';
    if (dropzoneBox) dropzoneBox.style.display = 'none';

    // Auto-completar título si está vacío
    if (resTitle && !resTitle.value.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      resTitle.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }

    // Auto-detectar categoría
    if (resType) {
      if (/\.(mp4|mov|webm|m4v|avi|mkv)$/i.test(file.name)) {
        resType.value = 'video';
      } else {
        resType.value = 'link';
      }
    }
  }

  function clearSelectedFile() {
    selectedFile = null;
    if (resFileInput) resFileInput.value = '';
    if (fileSelectedBadge) fileSelectedBadge.style.display = 'none';
    if (dropzoneBox) dropzoneBox.style.display = 'flex';
  }

  if (modeBtnFile && modeBtnUrl) {
    modeBtnFile.addEventListener('click', () => {
      currentUploadMode = 'file';
      modeBtnFile.classList.add('active');
      modeBtnUrl.classList.remove('active');
      if (fileUploadContainer) fileUploadContainer.style.display = 'block';
      if (urlInputContainer) urlInputContainer.style.display = 'none';
    });

    modeBtnUrl.addEventListener('click', () => {
      currentUploadMode = 'url';
      modeBtnUrl.classList.add('active');
      modeBtnFile.classList.remove('active');
      if (fileUploadContainer) fileUploadContainer.style.display = 'none';
      if (urlInputContainer) urlInputContainer.style.display = 'block';
    });
  }

  if (dropzoneBox && resFileInput) {
    dropzoneBox.addEventListener('click', () => {
      resFileInput.click();
    });

    resFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelected(e.target.files[0]);
      }
    });

    dropzoneBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneBox.classList.add('dragover');
    });

    dropzoneBox.addEventListener('dragleave', () => {
      dropzoneBox.classList.remove('dragover');
    });

    dropzoneBox.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneBox.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelected(e.dataTransfer.files[0]);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', () => {
      clearSelectedFile();
    });
  }

  function uploadFileToStorage(file, onProgress) {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `course_content/${timestamp}_${safeName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0 && onProgress) {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(percent);
          }
        },
        (error) => {
          console.error('Error subiendo a Firebase Storage:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  // Handle Adding Resources
  if (addResourceForm) {
    addResourceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = resTitle ? resTitle.value.trim() : '';
      const type = resType ? resType.value : 'link';
      let finalUrl = '';

      if (!title) {
        alert('Por favor ingresa un título para el material.');
        return;
      }

      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        if (currentUploadMode === 'file') {
          if (!selectedFile) {
            alert('Por favor selecciona o arrastra un archivo para subir a Firebase Storage, o cambia a la opción "Enlace externo".');
            if (submitBtn) submitBtn.disabled = false;
            return;
          }

          if (submitBtn) submitBtn.textContent = 'Subiendo archivo a Storage...';
          if (uploadProgressBox) uploadProgressBox.style.display = 'block';
          if (uploadProgressFill) uploadProgressFill.style.width = '0%';
          if (uploadPercentText) uploadPercentText.textContent = '0%';
          if (uploadStatusText) uploadStatusText.textContent = 'Subiendo a Firebase Storage...';

          finalUrl = await uploadFileToStorage(selectedFile, (pct) => {
            if (uploadProgressFill) uploadProgressFill.style.width = pct + '%';
            if (uploadPercentText) uploadPercentText.textContent = pct + '%';
            if (uploadStatusText) uploadStatusText.textContent = `Subiendo a Firebase Storage... ${pct}%`;
          });

          if (uploadStatusText) uploadStatusText.textContent = '¡Archivo en la nube! Guardando en base de datos...';
        } else {
          finalUrl = resUrl ? resUrl.value.trim() : '';
          if (!finalUrl) {
            alert('Por favor ingresa la URL del video o documento.');
            if (submitBtn) submitBtn.disabled = false;
            return;
          }
          if (submitBtn) submitBtn.textContent = 'Guardando en la nube...';
        }

        const token = await getAuthToken();
        const res = await fetch('/api/admin/resources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ title, type, url: finalUrl })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Error al guardar el recurso en el servidor');
        }

        addResourceForm.reset();
        clearSelectedFile();
        if (uploadProgressBox) uploadProgressBox.style.display = 'none';
        await loadResources();
        alert('✓ Recurso subido y guardado exitosamente en la plataforma.');
      } catch (error) {
        console.error('Error al guardar recurso:', error);
        alert('Error al guardar recurso: ' + (error.message || 'Error desconocido'));
      } finally {
        if (submitBtn) {
          submitBtn.textContent = '+ Subir a la plataforma';
          submitBtn.disabled = false;
        }
        if (uploadProgressBox) uploadProgressBox.style.display = 'none';
      }
    });
  }
}

