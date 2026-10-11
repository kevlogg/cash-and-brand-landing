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
    const snapshot = await db.collection('course_content').get();
    const resources = [];

    snapshot.forEach(doc => {
      resources.push({
        id: doc.id,
        ...doc.data()
      });
    });

    resources.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });

    return NextResponse.json({ resources });
  } catch (err: any) {
    console.error('Error fetching admin resources:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authCheck = await verifyAdmin(req);
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: 403 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: 'Firebase Admin Firestore not initialized' }, { status: 500 });
  }

  try {
    const { title, type, url } = await req.json();
    if (!title || !url) {
      return NextResponse.json({ error: 'Título y URL son obligatorios' }, { status: 400 });
    }

    const docRef = await db.collection('course_content').add({
      title,
      type: type || 'video',
      url,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: any) {
    console.error('Error adding admin resource:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authCheck = await verifyAdmin(req);
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: 403 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: 'Firebase Admin Firestore not initialized' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    await db.collection('course_content').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting admin resource:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
