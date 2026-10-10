import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
  const adminLoginState = document.getElementById('adminLoginState');
  const adminDashboardState = document.getElementById('adminDashboardState');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const btnLogout = document.getElementById('btnLogout');
  const usersTableBody = document.getElementById('usersTableBody');

  checkAdminSession();

  btnLogout.addEventListener('click', async () => {
    await signOut(auth);
    showLogin();
  });

  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showDashboard();
    } catch (error) {
      alert('Error de acceso: ' + error.message);
    }
  });

  function checkAdminSession() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        showDashboard();
      } else {
        showLogin();
      }
    });
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
});
