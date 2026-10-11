// @ts-nocheck
import { auth, db } from './firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

export function initAll() {
  const adminLoginState = document.getElementById('adminLoginState');
  const adminDashboardState = document.getElementById('adminDashboardState');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const btnLogout = document.getElementById('btnLogout');
  const usersTableBody = document.getElementById('usersTableBody');
  const addResourceForm = document.getElementById('addResourceForm');
  const resourcesList = document.getElementById('resourcesList');

  checkAdminSession();

  btnLogout.addEventListener('click', async () => {
    await signOut(auth);
    showLogin();
  });

  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await verifyAdminAccess(userCred.user);
    } catch (error) {
      alert('Error de acceso: ' + error.message);
    }
  });

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
      console.error(error);
      await signOut(auth);
      showLogin();
    }
  }

  function showLogin() {
    adminLoginState.style.display = 'block';
    adminDashboardState.style.display = 'none';
    btnLogout.style.display = 'none';
  }

  function showDashboard() {
    adminLoginState.style.display = 'none';
    adminDashboardState.style.display = 'block';
    btnLogout.style.display = 'block';
    loadUsers();
    loadResources();
  }

  async function loadUsers() {
    try {
      const q = query(collection(db, "profiles"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        usersTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay usuarios registrados aún.</td></tr>';
        return;
      }

      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      usersTableBody.innerHTML = users.map(user => {
      const date = new Date(user.created_at).toLocaleDateString('es-AR');
      const paidStatus = user.has_paid 
        ? '<span class="status-paid">Pagado</span>' 
        : '<span class="status-unpaid">Pendiente</span>';

      return `
        <tr>
          <td>${user.name || ''} ${user.surname || ''}</td>
          <td>${user.email}</td>
          <td>${date}</td>
          <td>${paidStatus}</td>
        </tr>
      `;
    }).join('');
    } catch (error) {
      console.error('Error fetching users:', error);
      usersTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error al cargar usuarios. Asegúrate de configurar la base de datos Firebase y Firestore.</td></tr>';
    }
  }

  async function loadResources() {
    try {
      const q = query(collection(db, "course_content"), orderBy("created_at", "asc"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        resourcesList.innerHTML = '<div style="color: #888; font-size: 0.9rem;">No hay recursos subidos.</div>';
        return;
      }

      const resources = [];
      querySnapshot.forEach((doc) => {
        resources.push({ id: doc.id, ...doc.data() });
      });

      resourcesList.innerHTML = resources.map(res => `
        <div style="background: #222; padding: 1rem; border-radius: 4px; border: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: bold; color: var(--text-primary);">${res.title}</div>
            <div style="font-size: 0.8rem; color: var(--accent-orange); text-transform: uppercase;">[${res.type}]</div>
          </div>
          <button class="btn-delete-res" data-id="${res.id}" style="background: #EF4444; color: #fff; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: bold;">✕</button>
        </div>
      `).join('');

      document.querySelectorAll('.btn-delete-res').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm('¿Seguro que quieres eliminar este recurso?')) {
            const id = e.target.getAttribute('data-id');
            await deleteDoc(doc(db, "course_content", id));
            loadResources();
          }
        });
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      resourcesList.innerHTML = '<div style="color: red;">Error al cargar recursos.</div>';
    }
  }

  addResourceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('resTitle').value;
    const type = document.getElementById('resType').value;
    const url = document.getElementById('resUrl').value;
    const btn = e.target.querySelector('button');

    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
      await addDoc(collection(db, "course_content"), {
        title,
        type,
        url,
        created_at: new Date().toISOString()
      });
      addResourceForm.reset();
      loadResources();
    } catch (error) {
      alert('Error guardando recurso: ' + error.message);
    } finally {
      btn.textContent = '+ Agregar Recurso';
      btn.disabled = false;
    }
  });
}

