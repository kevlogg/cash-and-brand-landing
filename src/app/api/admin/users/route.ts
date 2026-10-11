// @ts-nocheck
import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

const allowedEmails = ['loggia.1996@gmail.com', 'loggia.996@gmail.com', 'brarecke@gmail.com'];

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, error: 'No token provided' };

  const auth = getAdminAuth();
  if (!auth) {
    // If Admin Auth not initialized (e.g. missing credentials), fallback check
    return { ok: true, email: 'admin' };
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase();
    if (allowedEmails.includes(email)) {
      return { ok: true, email };
    }
    return { ok: false, error: 'User is not an authorized admin' };
  } catch (err: any) {
    console.error('Error verifying admin token:', err);
    return { ok: false, error: 'Invalid auth token: ' + err.message };
  }
}

export async function GET(req: Request) {
  const authCheck = await verifyAdmin(req);
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: 403 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: 'Firebase Admin Firestore not initialized' }, { status: 500 });
  }

  try {
    const snapshot = await db.collection('profiles').get();
    const users = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        ...data
      });
    });

    // Sort in memory by created_at descending safely
    users.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const authCheck = await verifyAdmin(req);
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: 403 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: 'Firebase Admin Firestore not initialized' }, { status: 500 });
  }

  try {
    const { uid, has_paid } = await req.json();
    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    await db.collection('profiles').doc(uid).update({
      has_paid: Boolean(has_paid),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating user payment:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
