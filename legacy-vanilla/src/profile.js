import { auth, db } from './backend.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
  const authCheck = document.getElementById('authCheck');
  const profileContent = document.getElementById('profileContent');
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const userNameLabel = document.getElementById('userNameLabel');
  const unpaidState = document.getElementById('unpaidState');
  const paidState = document.getElementById('paidState');
  const btnLogout = document.getElementById('btnLogout');
  const courseContentGrid = document.getElementById('courseContentGrid');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      loginModal.classList.remove('active');
      await loadUserProfile(user);
    } else {
      authCheck.style.display = 'none';
      profileContent.style.display = 'none';
      loginModal.classList.add('active');
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Error de acceso: ' + error.message);
    }
  });

  btnLogout.addEventListener('click', async () => {
    await signOut(auth);
  });

  async function loadUserProfile(user) {
    try {
      const userDocRef = doc(db, 'profiles', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      authCheck.style.display = 'none';
      profileContent.style.display = 'block';

      if (userDoc.exists()) {
        const data = userDoc.data();
        userNameLabel.textContent = `Hola, ${data.name || user.email}`;
        
        if (data.has_paid) {
          paidState.style.display = 'block';
          unpaidState.style.display = 'none';
          await loadCourseContent();
        } else {
          paidState.style.display = 'none';
          unpaidState.style.display = 'block';
        }
      } else {
        userNameLabel.textContent = `Hola, ${user.email}`;
        unpaidState.style.display = 'block';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Hubo un error cargando tu perfil.');
    }
  }

  async function loadCourseContent() {
    if (!courseContentGrid) return;
    try {
      const q = query(collection(db, "course_content"), orderBy("created_at", "asc"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        courseContentGrid.innerHTML = '<div style="color: var(--text-muted); text-align: center; width: 100%; grid-column: 1 / -1;">No hay contenido disponible por el momento. Pronto se subirán módulos.</div>';
        return;
      }

      const resources = [];
      querySnapshot.forEach((doc) => {
        resources.push(doc.data());
      });

      courseContentGrid.innerHTML = resources.map(res => {
        let icon = '📄';
        let actionStr = '';
        if (res.type === 'video') {
          icon = '▶';
          actionStr = `<a href="${res.url}" target="_blank" class="nav-btn" style="display:inline-block; font-size: 0.9rem; padding: 0.4rem 0.8rem; margin-top: 1rem;">Ver Video</a>`;
        } else if (res.type === 'link') {
          icon = '🔗';
          actionStr = `<a href="${res.url}" target="_blank" class="nav-btn" style="display:inline-block; font-size: 0.9rem; padding: 0.4rem 0.8rem; margin-top: 1rem;">Abrir Recurso</a>`;
        } else {
          actionStr = `<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem;">${res.url}</p>`;
        }

        return `
          <div class="video-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="video-card-thumb" style="font-size: 2rem;">${icon}</div>
              <h4 style="margin-bottom: 0.5rem;">${res.title}</h4>
            </div>
            ${actionStr}
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Error loading content:', error);
      courseContentGrid.innerHTML = '<div style="color: #EF4444; text-align: center; width: 100%; grid-column: 1 / -1;">Error al cargar el contenido.</div>';
    }
  }
});
