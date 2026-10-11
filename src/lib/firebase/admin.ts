// @ts-nocheck
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminApp() {
  if (!getApps().length) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'brianrecke';

    if (privateKey && clientEmail) {
      try {
        // Strip outer quotes if saved with quotes in Vercel or .env
        privateKey = privateKey.replace(/^["']|["']$/g, '');
        // Convert literal \n strings to real newlines
        privateKey = privateKey.replace(/\\n/g, '\n');

        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } catch (err) {
        console.error('Firebase Admin initializeApp error:', err);
      }
    } else {
      console.warn('Firebase Admin credentials missing from environment.');
    }
  }
  return getApps().length ? getApps()[0] : null;
}

export function getAdminDb() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export const ALLOWED_ADMIN_EMAILS = [
  'loggia.1996@gmail.com',
  'loggia.996@gmail.com',
  'brarecke@gmail.com'
];

export function isUserAdmin(profileData?: any, email?: string): boolean {
  const normEmail = (email || profileData?.email || '').toLowerCase().trim();
  if (normEmail && ALLOWED_ADMIN_EMAILS.some(adm => normEmail === adm.toLowerCase())) {
    return true;
  }
  if (normEmail && normEmail.includes('brarecke')) {
    return true;
  }
  if (profileData?.is_admin === true || profileData?.role === 'admin') {
    return true;
  }
  return false;
}

/**
 * Verifies that the incoming request contains a valid Firebase ID token
 * belonging to an authorized administrator.
 * Uses Google Identity Toolkit REST API to avoid CommonJS/ESM bundling conflicts
 * with jwks-rsa/jose in Next.js Serverless runtime.
 */
export async function verifyAdminRequest(req: Request): Promise<{ ok: boolean; email?: string; uid?: string; error?: string }> {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return { ok: false, error: 'No se proporcionó token de autenticación (Bearer token faltante)' };
    }

    const apiKey =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.VITE_FIREBASE_API_KEY ||
      'AIzaSyCAmtjr1hsdLEOdoigmWfQym5DjXa-RQio';

    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    if (!verifyRes.ok) {
      const errJson = await verifyRes.json().catch(() => ({}));
      console.warn('Google Identity token validation failed:', errJson);
      return { ok: false, error: 'Token de sesión expirado o inválido' };
    }

    const data = await verifyRes.json();
    const user = data.users && data.users[0];
    const email = (user?.email || '').toLowerCase().trim();
    const uid = user?.localId;

    if (!email) {
      return { ok: false, error: 'No se pudo identificar el email del usuario en Firebase' };
    }

    if (ALLOWED_ADMIN_EMAILS.includes(email)) {
      return { ok: true, email, uid };
    }

    // Secondary check: verify if profile in Firestore has is_admin == true
    const db = getAdminDb();
    if (db && uid) {
      const profileSnap = await db.collection('profiles').doc(uid).get();
      if (profileSnap.exists && profileSnap.data()?.is_admin === true) {
        return { ok: true, email, uid };
      }
    }

    return { ok: false, error: `El usuario (${email}) no tiene permisos de administrador` };
  } catch (error: any) {
    console.error('verifyAdminRequest unexpected error:', error);
    return { ok: false, error: 'Error interno al validar permisos: ' + (error.message || 'Desconocido') };
  }
}
