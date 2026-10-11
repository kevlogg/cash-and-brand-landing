// @ts-nocheck
import { NextResponse } from 'next/server';
import { getAdminDb, verifyAdminRequest } from '@/lib/firebase/admin';

export async function GET(req: Request) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin Firestore no está disponible en el servidor' }, { status: 500 });
    }

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
    return NextResponse.json({ error: 'Error del servidor: ' + (err.message || 'Desconocido') }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin Firestore no está disponible en el servidor' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, type, url } = body;
    if (!title || !url) {
      return NextResponse.json({ error: 'Título y URL son campos obligatorios' }, { status: 400 });
    }

    const docRef = await db.collection('course_content').add({
      title: title.trim(),
      type: type || 'video',
      url: url.trim(),
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: any) {
    console.error('Error adding admin resource:', err);
    return NextResponse.json({ error: 'Error al agregar recurso: ' + (err.message || 'Desconocido') }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin Firestore no está disponible en el servidor' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta el parámetro id del recurso' }, { status: 400 });
    }

    await db.collection('course_content').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting admin resource:', err);
    return NextResponse.json({ error: 'Error al eliminar recurso: ' + (err.message || 'Desconocido') }, { status: 500 });
  }
}
